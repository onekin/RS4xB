package org.onekin.splminer.utils;

import org.onekin.splminer.domain.Feature;
import org.onekin.splminer.main.FeatureCodeMiner;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;

public class GenericUtils {

    private static ArrayList<String> ids = new ArrayList<>();

    public static String generateID() {
        // Generate random ID
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789_-"; // 63 chars

        Random rand = new Random();

        String result = "i";

        while (result.length() <= 16) {
            result += chars.charAt(rand.nextInt(63));
        }

        if (ids.contains(result)) // This ID is not unique
            return generateID();

        return result; // This ID is unique
    }

    public static String combinePaths(String base, String newPath) {

        if (base == null || newPath == null) {
            return null;
        }

        if (newPath.contentEquals(".")) {
            return base;
        }

        String[] baseParts = base.split("/");
        String[] newPathParts = newPath.split("/");

        int baseStart = 0;
        int baseEnd = baseParts.length - 1;
        int newPathStart = 0;
        String start = "";

        if (newPathParts[0].contentEquals(".") || newPathParts[0].contentEquals("")) {
            newPathStart = 1;
        } else if (newPathParts[0].contentEquals("..")) {
            baseEnd -= 1;
            newPathStart = 1;
        }

        if (baseParts[0].contentEquals("")) {
            baseStart = 1;
            start = "/";
        }

        String path = start;
        for (int i = baseStart; i <= baseEnd; i++) {
            path += baseParts[i] + "/";
        }

        for (int j = newPathStart; j < newPathParts.length; j++) {
            path += newPathParts[j] + "/";
        }

        return path.substring(0, path.length() - 1);

    }

    public static int fileSize(String path) {
        int charCount = 0;

        try {
            BufferedReader bf = new BufferedReader(new FileReader(path));

            while (bf.readLine() != null) {
                charCount += 1;
            }

            bf.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return charCount;
    }

    public static String repeat(String s, int i) {
        String r = "";
        for (int j = 0; j < i; j++) {
            r += s;
        }

        return r;
    }

    public static void writeToCsv(Map<String, Map<String, Double>> tanglingSimilarityMap, Map<String, Map<String, Double>> crosscuttingSimilarityMap, List<Feature> features) throws IOException {
        File tanglingSimilarityCSV = new File(FeatureCodeMiner.LOCAL_REPO_PATH+"tanglingSimilarity.csv");
        File crosscuttingSimilarityCSV = new File(FeatureCodeMiner.LOCAL_REPO_PATH+"crosscuttingSimilarity.csv");
        PrintWriter tanglingWriter = new PrintWriter(tanglingSimilarityCSV);
        PrintWriter croscuttingWriter = new PrintWriter(crosscuttingSimilarityCSV);
        String header = " ," +StringUtils.join(features, ',')+'\n';
        tanglingWriter.write(header);
        croscuttingWriter.write(header);
        String currentTanglingSimValue;
        String currentCrosscuttingSimValue;
        for (Feature featureA : features) {
            tanglingWriter.write(featureA.getName()+',');
            croscuttingWriter.write(featureA.getName()+',');
            for (int i=0; i<features.size();i++) {
                if(i!=features.size()-1) {
                    currentCrosscuttingSimValue = crosscuttingSimilarityMap.get(featureA.getName()).get(features.get(i).getName())+",";
                    currentTanglingSimValue = tanglingSimilarityMap.get(featureA.getName()).get(features.get(i).getName())+",";
                }else{
                    currentCrosscuttingSimValue = crosscuttingSimilarityMap.get(featureA.getName()).get(features.get(i).getName()).toString();
                    currentTanglingSimValue = tanglingSimilarityMap.get(featureA.getName()).get(features.get(i).getName()).toString();
                }
                tanglingWriter.write(currentTanglingSimValue);
                croscuttingWriter.write(currentCrosscuttingSimValue);

            }
            tanglingWriter.write('\n');
            croscuttingWriter.write('\n');
        }
        croscuttingWriter.close();
        tanglingWriter.close();
    }

}
