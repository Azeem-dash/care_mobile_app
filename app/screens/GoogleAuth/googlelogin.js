import React, {useState, useEffect} from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {Button} from '@components';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiList from '../../apiList';
import jwt_decode from 'jwt-decode';

const GoogleButton = () => {
  const [Name, setName] = useState('Use Google Account');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [AccessToken, setAccessToken] = useState();
  const [UserData, setUserData] = useState();
  // authenticates user and redirects to home
  const authentication = () => {
    setLoading(true);
    dispatch(AuthActions.authentication(true));
  };
  WebBrowser.maybeCompleteAuthSession();
  const [request, response, pormptAsync] = Google.useIdTokenAuthRequest({
    expoClientId:
      '300253106599-071h9bj2d0dmim881ee9fpt7psjdn3me.apps.googleusercontent.com',
    webClientId:
      '300253106599-41cl9md537r9taodbvfmsllta6khmip3.apps.googleusercontent.com',
    iosClientId:
      '300253106599-8o6eimnmfhulql21h0uo1t2m7tf6qbtn.apps.googleusercontent.com',
    androidClientId:
      '300253106599-te2bu2k0dmh0db7dgd2ra047aa8dhgtj.apps.googleusercontent.com',
      
  });
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('response ');
      setAccessToken(response);
      setUserData(jwt_decode(response.params.id_token));

      AccessToken && getUserData();
    }
  }, [response, AccessToken]);

  //webclientId= 300253106599-41cl9md537r9taodbvfmsllta6khmip3.apps.googleusercontent.com
  //ios Clint id= 300253106599-8o6eimnmfhulql21h0uo1t2m7tf6qbtn.apps.googleusercontent.com
  //android =300253106599-te2bu2k0dmh0db7dgd2ra047aa8dhgtj.apps.googleusercontent.com

  //stores data presistive state
  const storeData = async (value, id) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value);
      await AsyncStorage.setItem('@storage_Key_id', id);
    } catch (e) {
      // saving error
    }
  };

  // async function signInWithGoogleAsync() {
  //   try {
  //     const result = await Google.logInAsync({
  //       androidClientId:
  //         '736126909442-mfmp94pm94urap5kimrl8ocvkfak03bd.apps.googleusercontent.com',
  //       iosClientId:
  //         '663215841316-9pd6e3ne5bj7tgisd6o45h0dgoj903av.apps.googleusercontent.com',
  //       scopes: ['profile', 'email'],
  //     });
  //     if (result.type === 'success') {
  //       getUserData(result.accessToken);
  //     } else {
  //       console.log('Permission denied');
  //     }
  //   } catch (e) {
  //     setLoading(false);
  //     console.log('error', e);
  //     setName('Error Logging in');
  //   }
  // }

  async function getUserData() {
    // let userInfoResponse = await fetch(
    //   'https://www.googleapis.com/userinfo/v2/me',
    //   {
    //     headers: {Authorization: `Bearer ${AccessToken}`},
    //   },
    // );

    // userInfoResponse.json().then(data => {
      console.log({
        name: UserData.name,
        email: UserData.email,
        password: UserData.email + UserData.name,
        image: UserData.picture,
      });
      // your host api for the backend will go here
      await axios
        .post(apiList.signup, {
          name: UserData.name,
          email: UserData.email,
          password: UserData.email + UserData.name,
          image: UserData.picture,
        })
        .then(res => {
          // safing token in presistive state
          storeData(res.data.token, res.data.id);
          authentication();
        })
        .catch(e => {
          setLoading(false);
          setName('Error Logging in');
        });
    // });
  }

  return (
    <Button
      loading={loading}
      onPress={() => {
        pormptAsync();
      }}>
      {Name}
    </Button>
  );
};

export default GoogleButton;
