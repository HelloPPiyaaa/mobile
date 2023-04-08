import * as React from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';


export default function LoginScreen() {
  // Ref or state management hooks
  const app = getApp();
  const auth = getAuth();
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();


  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;


  return (

    <View style={{ width: '100%', height: '100%',backgroundColor:"#1E1E1E" ,padding:20 , marginTop:0 }}>

      <Text style={{textAlign:'center', fontSize:40 , color:"white", marginBottom:70, marginTop:30}}>MUSIC EIEI</Text>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // attemptInvisibleVerification
      />
      <Text style={{ marginTop: 20 , color:"white"}}>กรอกหมายเลขโทรศัพท์</Text>
      <TextInput
        style={{ marginVertical: 6, fontSize: 17 ,borderRadius: 10 ,padding:5 , backgroundColor:"#1E1E1E" , borderColor:"white" , borderWidth:0.5 ,marginBottom:20}}
        placeholder="+66 999 999 9999" 
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
      />
      <Button
        title="Send Verification Code"
        disabled={!phoneNumber}
        onPress={async () => {
          // The FirebaseRecaptchaVerifierModal ref implements the
          // FirebaseAuthApplicationVerifier interface and can be
          // passed directly to `verifyPhoneNumber`.
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            showMessage({
              text: 'Verification code has been sent to your phone.',
            });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      <Text style={{ marginTop: 20,color:"white" }}>กรอกหมายเลข OTP</Text>
      <TextInput
        style={{ marginVertical: 15, fontSize: 17 ,borderRadius: 10 ,padding:5 , backgroundColor:"#1E1E1E" , borderColor:"white" , borderWidth:0.5 ,marginBottom:20}}
        editable={!!verificationId}
        placeholder="1234"
        onChangeText={setVerificationCode}
      />


      <Button 
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await signInWithCredential(auth, credential);
            showMessage({ text: 'Phone authentication successful 👍' });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
          </Text>
        </TouchableOpacity>
        
      ) : (
        undefined
      )}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
    
  );

  
}



