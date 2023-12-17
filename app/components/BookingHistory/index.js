import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, TextInput} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {useDispatch, useStore} from 'react-redux';
import {ApplicationActions} from '@actions';
import axios from 'react-native-axios';
import apiList, {serverIp} from '../../apiList';

export default function BookingHistory(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {style, question, number, answers, onPress} = props;
  const [Answer, setAnswer] = useState(null);
  const notSelected = {a: '#98b6e3', b: '#98b6e3', c: '#98b6e3', d: '#98b6e3'};
  const [selected, setSelected] = useState({
    a: '#98b6e3',
    b: '#98b6e3',
    c: '#98b6e3',
    d: '#98b6e3',
  });

  const dispatch = useDispatch();

  const addScore = (selected, value) => {
    // setSelected({...notSelected, [selected]: '#57948f'});
    dispatch(ApplicationActions.onAddition(value));
  };
  const CheckAnalyze = async () => {
    onPress(true);

    // const MoodRes = await axios
    //   .get(`http://careapp.pythonanywhere.com?text=${Answer}`)
    //   .then(res => {
    //     console.log('data from api->', res.data.generated_text);
    //   })
    //   .catch(err => {
    //     console.log('Error while fecting data from pythonanywhere api:  ', err);
    //   });
    try {
      console.log("Answer-> ",Answer);
      const MoodRes = await axios.get(
        `http://careapp.pythonanywhere.com?text=${Answer}`,
      );
      console.log('response->', MoodRes.data.generated_text);

      let nutral = {
        description: 'no activicty added',
        image: null,
        mood: 'nutral',
        name: 'no activicty',
        _id: 'nutral123',
      };
      if (MoodRes.data.generated_text) {
        let RamdomArray = [];
        await axios
          .get(apiList.GetDisplayActivity)
          .then(res => {
            // console.log("res ", res.data);
            res.data.forEach(element => {
              if (element.mood === MoodRes.data.generated_text) {
                RamdomArray.push(element);
                addScore(element);
              }
            });
            // setActivities(res.data);
          })
          .catch(e => {
            console.log(e);
          });
        // console.log('RamdomArray ', RamdomArray);
        if (RamdomArray.length > 0) {
          const random = Math.floor(Math.random() * RamdomArray.length);
          answers(RamdomArray[random]);
        } else {
          answers(nutral);
        }
      } else {
        let nutral = {
          description: 'nutral',
          image: null,
          mood: 'nutral',
          name: 'nutral',
          _id: 'nutral123',
        };
        answers(nutral);
      }
      // console.log('Ramdon->>>>> res ', random, RamdomArray[random]);
    } catch (error) {
      console.log('Error while getting moods', error);
      answers('error');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.contain, {shadowColor: colors.border}, style]}
      activeOpacity={1}>
      <View
        style={[
          styles.nameContent,
          {
            borderBottomColor: colors.card,
            backgroundColor: colors.primaryLight,
          },
        ]}>
        <Text body2 whiteColor semibold>
          Question # {number}
        </Text>
      </View>
      <View
        style={[styles.mainContent, {backgroundColor: colors.primaryLight}]}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text whiteColor>{question}</Text>
        </View>
      </View>
      <View>
        <TextInput
          onChangeText={text => {
            setAnswer(text);
          }}
          // secureTextEntry={true}
          placeholder={'Enter your answer'}
          value={Answer}
        />
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: '#466fc7',
            padding: 30,
            borderRadius: 10,
            marginHorizontal: '5%',
            display: 'flex',
          }}
          onPress={() => {
            CheckAnalyze();
          }}
          activeOpacity={0.5}>
          <Text
            overline
            semibold
            style={{textAlign: 'center', color: 'white', fontSize: 20}}>
            Analyze
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={[styles.validContent, {backgroundColor: colors.card}]}>
        <TouchableOpacity
          style={{
            backgroundColor: selected.a,
            padding: 5,
            borderRadius: 10,
            flexShrink: 1,
            maxWidth: '25%',
            minWidth: '25%',
            margin: '1%',
            marginLeft: '-3%',
          }}
          onPress={() => addScore('a', scores[0])}
          activeOpacity={0.5}>
          <Text overline semibold>
            {answers[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selected.b,
            padding: 5,
            borderRadius: 10,
            flexShrink: 1,
            maxWidth: '25%',
            minWidth: '25%',
            margin: '1%',
          }}
          onPress={() => addScore('b', scores[1])}
          activeOpacity={0.5}>
          <Text overline semibold>
            {answers[1]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selected.c,
            padding: 5,
            borderRadius: 10,
            flexShrink: 1,
            maxWidth: '25%',
            minWidth: '25%',
            margin: '1%',
          }}
          onPress={() => addScore('c', scores[2])}
          activeOpacity={0.5}>
          <Text overline semibold>
            {answers[2]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selected.d,
            padding: 5,
            borderRadius: 10,
            flexShrink: 1,
            maxWidth: '25%',
            minWidth: '25%',
            margin: '1%',
          }}
          onPress={() => addScore('d', scores[3])}
          activeOpacity={0.5}>
          <Text overline semibold>
            {answers[3]}
          </Text>
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  );
}

BookingHistory.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  question: PropTypes.string,
  answer: PropTypes.string,
  scores: PropTypes.array,
};

BookingHistory.defaultProps = {
  question: '',
  answer: '',
  scores: [],
  style: {},
};
