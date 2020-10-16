// PVSCL:IFCOND(Neo4J, LINE)
      <div id="neo4jConfigurationCard" class="card storageConfiguration">
        <a id="neo4jConfiguration"></a>
        <div class="card-header bg-dark text-white">Neo4J configuration</div>
        <div class="card-body">
          <div class="form-group">
            <label for="neo4jEndpoint" class="requiredFormInput">Endpoint URL</label>
            <input type="url" class="form-control" id="neo4jEndpoint" placeholder="Enter your neo4j endpoint">
          </div>
          <div class="form-group">
            <label for="neo4jToken" class="requiredFormInput">Token</label>
            <input type="text" class="form-control" id="neo4jToken" placeholder="Enter your neo4j token">
          </div>
          <div class="form-group">
            <label for="neo4jUser">User</label>
            <input type="text" class="form-control" id="neo4jUser" placeholder="Enter your username or orcid">
          </div>
        </div>
      </div>
      // PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)
      if (annotationServer === 'neo4j') {
        // Browser storage
        const Neo4JClientManager = require('../annotationServer/neo4j/Neo4JClientManager').default
        window.abwa.annotationServerManager = new Neo4JClientManager()
      }
      // PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)
    // Neo4J Configuration
    this.neo4JEndpointElement = document.querySelector('#neo4jEndpoint')
    this.neo4JTokenElement = document.querySelector('#neo4jToken')
    this.neo4JUserElement = document.querySelector('#neo4jUser')
    this.neo4JEndpointElement.addEventListener('keyup', this.createNeo4JConfigurationSaveEventHandler())
    this.neo4JTokenElement.addEventListener('keyup', this.createNeo4JConfigurationSaveEventHandler())
    this.neo4JUserElement.addEventListener('keyup', this.createNeo4JConfigurationSaveEventHandler())
    // Restore form from credentials saved in storage
    chrome.runtime.sendMessage({ scope: 'neo4j', cmd: 'getCredentials' }, ({ credentials }) => {
      this.neo4JEndpointElement.value = credentials.endpoint || ''
      this.neo4JTokenElement.value = credentials.token || ''
      this.neo4JUserElement.value = credentials.user || ''
    })
    // PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)

  createNeo4JConfigurationSaveEventHandler () {
    return (e) => {
      this.saveNeo4JConfiguration()
    }
  }

  saveNeo4JConfiguration () {
    // Check validity
    if (this.neo4JEndpointElement.checkValidity() && this.neo4JTokenElement.checkValidity() && this.neo4JUserElement.checkValidity()) {
      const credentials = {
        endpoint: this.neo4JEndpointElement.value,
        token: this.neo4JTokenElement.value,
        user: this.neo4JUserElement.value
      }
      chrome.runtime.sendMessage({
        scope: 'neo4j',
        cmd: 'setCredentials',
        data: { credentials: credentials }
      }, ({ credentials }) => {
        console.debug('Saved credentials ' + JSON.stringify(credentials))
      })
    }
  }
  // PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)
import Neo4JManager from './background/Neo4JManager'
// PVSCL:ENDCOND// PVSCL:IFCOND(Neo4J, LINE)
    // Initialize hypothesis manager
    this.neo4jManager = new Neo4JManager()
    this.neo4jManager.init()

    // PVSCL:ENDCOND