import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import * as Speech from "expo-speech";

export default function App() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript ?? "");
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    console.log("Permission result:", result);

    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };
  const speak = () => {
    let thingToSay = transcript;
    if (thingToSay) {
      Speech.speak(thingToSay);
    } else {
      Speech.speak("No speech recognized yet.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.buttonContainer}>
        {!recognizing ? (
          <Button title="Start Listening" onPress={handleStart} />
        ) : (
          <Button
            title="Stop Listening"
            onPress={() => ExpoSpeechRecognitionModule.stop()}
            color="red"
          />
        )}
      </View>
      <View style={styles.container}>
        <Button title="Press to hear some words" onPress={speak} />
      </View>
      <ScrollView contentContainerStyle={styles.transcriptContainer}>
        <Text style={styles.transcriptText}>{transcript}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  transcriptContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  transcriptText: {
    fontSize: 18,
    textAlign: "center",
  },
});
