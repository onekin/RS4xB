-- USE SPL;

CREATE TABLE CMAP(
	ID VARCHAR(50) NOT NULL,
	NAME VARCHAR(50) NOT NULL,
	SPL_ID VARCHAR(50) NOT NULL,
	CONSTRAINT CMAP_PK PRIMARY KEY (ID),
	CONSTRAINT CMAP_FK_SPL_ID FOREIGN KEY (SPL_ID) REFERENCES SPL(ID)
);

CREATE TABLE LINK_ELEMENT(
	ID VARCHAR(50) NOT NULL,
	LABEL VARCHAR(100) NOT NULL,
	CMAP VARCHAR(50) NOT NULL,
	CONSTRAINT LINK_ELEMENT_PK PRIMARY KEY (ID),
	CONSTRAINT LINK_ELEMENT_FK_CMAP FOREIGN KEY (CMAP) REFERENCES CMAP(ID)
);

CREATE TABLE CONCEPT(
	ID VARCHAR(50) NOT NULL,
	CONSTRAINT CONCEPT_PK PRIMARY KEY (ID),
	CONSTRAINT CONCEPT_FK_ID FOREIGN KEY (ID) REFERENCES LINK_ELEMENT(ID)
);

CREATE TABLE LINKING_PHRASE(
	ID VARCHAR(50) NOT NULL,
	CONSTRAINT LINKING_PHRASE_PK PRIMARY KEY (ID),
	CONSTRAINT LINKING_PRHASE_FK FOREIGN KEY (ID) REFERENCES LINK_ELEMENT(ID)
);

CREATE TABLE CONNECTION(
	ID VARCHAR(50) NOT NULL,
	FROM_ID VARCHAR(50) NOT NULL,
	TO_ID VARCHAR(50) NOT NULL,
	CMAP VARCHAR(50) NOT NULL,
	CONSTRAINT CONNECTION_PK PRIMARY KEY (ID),
	CONSTRAINT CONNECTION_FK_FROM FOREIGN KEY (FROM_ID) REFERENCES LINK_ELEMENT(ID),
	CONSTRAINT CONNECTION_FK_TO FOREIGN KEY (TO_ID) REFERENCES LINK_ELEMENT(ID),
	CONSTRAINT CONNECTION_FK_CMAP FOREIGN KEY (CMAP) REFERENCES CMAP(ID)
);

CREATE TABLE RESOURCE(
	ID VARCHAR(50) NOT NULL,
	LABEL VARCHAR(100) NOT NULL,
	DESCRIPTION VARCHAR(200),
	URL VARCHAR(100),
	PARENT_ID VARCHAR(50) NOT NULL,
	CMAP VARCHAR(50) NOT NULL,
	CONSTRAINT RESOURCE_PK PRIMARY KEY (ID),
	CONSTRAINT RESOURCE_FK_PARENT_ID FOREIGN KEY (PARENT_ID) REFERENCES LINK_ELEMENT(ID)
);

/* CONNECTION LINK_ELEMENT AND FEATURE */

CREATE TABLE FEATURE_LINK_ELEMENT(
	LINK_ELEMENT_ID VARCHAR(50) NOT NULL,
	FEATURE_ID VARCHAR(50) NOT NULL,
	CONSTRAINT FEATURE_LINK_ELEMENT_PK PRIMARY KEY (LINK_ELEMENT_ID,FEATURE_ID),
	CONSTRAINT FEATURE_LINK_ELEMENT_FK_LINK_ELEMENT FOREIGN KEY (LINK_ELEMENT_ID) REFERENCES LINK_ELEMENT(ID),
	CONSTRAINT FEATURE_LINK_ELEMENT_FK_FEATURE FOREIGN KEY (FEATURE_ID) REFERENCES FEATURE (ID) ON DELETE CASCADE
);
