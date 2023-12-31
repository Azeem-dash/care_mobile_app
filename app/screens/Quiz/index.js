import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {BaseStyle} from '@config';
import {
  Header,
  SafeAreaView,
  BookingHistory,
  Text,
  Card,
  Button,
} from '@components';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useDispatch, useStore} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';
import apiList, {serverIp} from '../../apiList';
import {ApplicationActions} from '@actions';
import styles from './styles';
import {useIsFocused} from '@react-navigation/native';

//todo
// get mode based activity
// rout to activity with data to show activity details
// get activity api is now post because get dont body

export default function Booking({navigation}) {
  const {t} = useTranslation();
  const [result, setResult] = useState(false);
  const [activity, setActivity] = useState({
    name: 'no name',
    mood: 'no mood',
    description: 'no desc',
    image:
      'https://ogden_images.s3.amazonaws.com/www.motherearthliving.com/images/2019/04/20130432/79F3E4F401294522A93B04BDF9F1B634-300x300.jpg',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [DateofQuiz, setDateofQuiz] = useState();
  const totalScore = useSelector(state => state.application);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getDailyData = async () => {
    try {
      const id = await AsyncStorage.getItem('@storage_Key_id');
      if (id !== null) {
        await axios
          .get(apiList.GetDailyData + `/${id}`)
          .then(res => {
            // console.log("res",res.data);
            if (res.data !== null) {
              setIsLoading(false);
              // console.log("GetDailyData-> ",res.data.item);
              // getMoodActivity();
              setDateofQuiz(res.data.item.dateOfQuiz);
              setResult(res.data.item.score);
              setActivity({
                name: res.data.item.score.name,
                mood: res.data.item.score.mood,
                description: res.data.item.score.description,
                image: res.data.item.score.image,
              });
            } else {
              getQuiz();
            }
          })
          .catch(e => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getResult = async item => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        axios
          .get(apiList.getUserDate, {
            headers: {
              Authorization: `Bearer ${value}`,
            },
          })
          .then(res => {
            axios
              .post(apiList.SubmitQuiz, {
                _id: res.data._id,
                score: item,
              })
              .then(res => {
                console.log(res.data.message);
                getDailyData();
              });
          });
      }
    } catch (e) {
      console.log(e);
    }
  };
  // questions will be retrived form database and on every answer score will be added to a react hook every answer has a score from 1-10 and max 10 question so total score 100 annd at end uswr will press submit end quiz
  const [quiz, setQuiz] = useState([
    {
      question:
        'How often have you been bothered by feeling bad about yourself, or that you are a failure, or have let yourself or your family down?',
      answers: [
        'not at all',
        'several days',
        'more then half a day',
        'every day',
      ],
      score: [1, 4, 6, 10],
      mumber: 1,
    },
  ]);

  const getQuiz = () => {
    let array = [];
    axios
      .get(apiList.getQuiz)
      .then(res => {
        if (res.data > 0) {
          setIsLoading(false);
          array.push(res.data[0]);
          setQuiz(array);
        } else {
          setIsLoading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getMoodActivity = () => {
    axios
      .post(apiList.GetMoodActivity, {mood: result.mood})
      .then(res => {
        setActivity({
          name: res.data[0].name,
          mood: res.data[0].mood,
          description: res.data[0].description,
          image: res.data[0].image,
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    // const focusHandler = navigation.addListener('focus', () => {
    //   getDailyData();
    // });
    // return focusHandler;
    getDailyData();
  }, [isFocused]);

  const renderItem = (item, index) => {
    return (
      <BookingHistory
        key={index}
        question={item.question}
        answers={res => {
          console.log('response got', res.mood);
          if (res != 'error') {
            getResult(res);
          } else {
            alert('unknown Error occured!');
            setIsLoading(false);
          }
        }}
        number={item.number}
        style={{paddingVertical: 10, marginHorizontal: 20}}
        onPress={pressed => {
          setIsLoading(pressed);
        }}
      />
    );
  };
  {
    /* <iframe src="https://giphy.com/embed/jAYUbVXgESSti" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/google-icon-loading-jAYUbVXgESSti">via GIPHY</a></p> */
  }
  return (
    <View style={{flex: 1}}>
      <Header title={t('Quiz')} />
      {isLoading ? (
        <View>
          <Image
            style={{
              height: 200,
              width: 200,
              alignSelf: 'center',
            }}
            source={require('../../../assets/load-37_256.gif')}
          />
        </View>
      ) : (
        // <ActivityIndicator size="large" color="#00ff00" />
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          edges={['right', 'left', 'bottom']}>
          {!result ? (
            <FlatList
              data={quiz}
              renderItem={({item, index}) => renderItem(item, index)}
            />
          ) : (
            <>
              <View style={styles.banner}>
                <Text
                  overline
                  semibold
                  style={{textAlign: 'center', color: 'black', fontSize: 20}}>
                  You did it!
                </Text>
                <Text
                  overline
                  style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                  You took the quiz on
                </Text>
                <Text
                  overline
                  semibold
                  style={{textAlign: 'center', color: 'black', fontSize: 20}}>
                  {DateofQuiz?.substring(0, 10)}
                </Text>
                <Text
                  overline
                  style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                  according to your answers
                </Text>
                <Text
                  overline
                  style={{textAlign: 'center', color: 'black', fontSize: 15}}>
                  you must be feeling
                </Text>
                <Text
                  overline
                  semibold
                  style={{textAlign: 'center', color: 'black', fontSize: 20}}>
                  {result.mood}
                </Text>
              </View>
              <Card
                style={[styles.promotionItem]}
                image={activity.image}
                onPress={() =>
                  navigation.navigate('Event', {activity: activity})
                }>
                <Text subhead whiteColor>
                  Recomenended Activity
                </Text>
                <Text title2 whiteColor semibold>
                  {activity.name}
                </Text>
                <View style={styles.contentCartPromotion}>
                  <Button
                    style={styles.btnPromotion}
                    onPress={() =>
                      navigation.navigate('Event', {activity: activity})
                    }>
                    <Text body2 semibold whiteColor>
                      More Details
                    </Text>
                  </Button>
                </View>
              </Card>
            </>
          )}
        </SafeAreaView>
      )}
    </View>
  );
}
