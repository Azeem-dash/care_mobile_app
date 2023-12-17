import React, {useEffect, useState} from 'react';
import {RefreshControl, FlatList, View} from 'react-native';
import {BaseColor, useTheme, DefaultFont} from '@config';
import {Text, Icon, FormOption} from '@components';
import {Header, SafeAreaView, ListThumbSquare} from '@components';
import styles from './styles';
import {MessagesData} from '@data';
import {useTranslation} from 'react-i18next';
import axios from 'react-native-axios';
import apiList from '../../apiList';
import {Calendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
//todo
// history color according to mode
// getting history data

export default function Messenger({navigation}) {
  const isFocused = useIsFocused();
  // const [requests, setRequests] = useState('');
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [userData, setUserdata] = useState('');
  const [refreshing] = useState(false);
  const [messenger] = useState(MessagesData);
  const [history, setHistory] = useState({});

  const getColorMood = score => {
    // console.log(score);

    switch (true) {
      case score === 'depressed':
        return '#ff7575';

      case score === 'sadness':
        return '#ff8c75';

      case score === 'upset':
        return '#ffa375';

      case score === 'fear':
        return '#ffba75';

      case score === 'anger':
        return '#ffd375';

      case score === 'calm':
        return '#efff75';

      case score === 'relaxed':
        return '#c3ff75';

      case score === 'love':
        return '#8aff75';

      case score === 'surprise':
        return '#75ffb3';

      case score === 'joy':
        return '#75ffe6';
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');

      if (value != null) {
        axios
          .get(apiList.getUserDate, {
            headers: {
              Authorization: `Bearer ${value}`,
            },
          })
          .then(res => getHistory(res.data._id))
          .catch(e => console.log(e));
        // console.log(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getHistory = id => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 2)
      .toISOString('uk')
      .substring(0, 10);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1)
      .toISOString('uk')
      .substring(0, 10);

    // post api because get dont haves

    // console.log({
    //   sdate: firstDay, // first day of month
    //   edate: lastDay, // last day of month
    //   userId: id,
    // });
    axios
      .post(apiList.GetMonthData, {
        sdate: firstDay, // first day of month
        edate: lastDay, // last day of month
        userId: id,
      })
      .then(res => {
        const x = {};
        res.data.forEach(item => {
          console.log("item ",item?.score?.mood);
          // console.log( getColorMood("res->> >> >> ",item?.score?.mood));
          x[item.dateOfQuiz.substring(0, 10)] = {
            customStyles: {
              container: {
                backgroundColor: getColorMood(item?.score?.mood),
              },
              text: {
                color: 'black',
                fontWeight: 'bold',
              },
            },
          };
        });
        // console.log(x);
        setHistory(x);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <Header title={t('History')} />

      <View style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
        <Calendar markingType={'custom'} markedDates={history} />
      </View>

      <FormOption style={{marginTop: 20}} />
    </View>
  );
}
