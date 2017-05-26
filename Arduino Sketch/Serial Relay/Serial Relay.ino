void setup() {
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(2) == LOW) {
    Serial.write(0);
  } else {
    Serial.write(analogRead(A0) >> 2);
  }
}
