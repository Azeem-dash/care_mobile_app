import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Icon} from '@components';
import styles from './styles';
import {useTheme} from '@config';
import axios from 'react-native-axios';
import {useIsFocused} from '@react-navigation/native';
import apiList, {serverIp} from '../../apiList';

export default function FormOption(props) {
  const [getMooda, setGetMooda] = useState([]);
  const {colors} = useTheme();
  const [is_loading, setIs_loading] = useState(true);
  const {style} = props;
  const isFocused = useIsFocused();
  // const CheckAnalyze = async () => {
  //   let moods = [];
  //   await axios
  //     .get(apiList.GetDisplayActivity)
  //     .then(res => {
  //       setIs_loading(false);
  //       res.data.forEach(element => {
  //         // console.log("element",element.mood);
  //         if (element.mood === 'sadness') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'sad-tear',
  //             color: '#ff8c75',
  //           });
  //         } else if (element.mood === 'joy') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'grin-stars',
  //             color: '#75ffe6',
  //           });
  //         } else if (element.mood === 'love') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'grin-alt',
  //             color: '#8aff75',
  //           });
  //         } else if (element.mood === 'anger') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'meh',
  //             color: '#ffd375',
  //           });
  //         } else if (element.mood === 'fear') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'flushed',
  //             color: '#ffba75',
  //           });
  //         }
  //         if (element.mood === 'surprise') {
  //           moods.push({
  //             name: element.mood,
  //             icon: 'grin-beam',
  //             color: '#75ffb3',
  //           });
  //         } else {
  //           setIs_loading(false);
  //         }
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  //   setGetMooda(moods);
  // };
  // useEffect(() => {
  //   CheckAnalyze();
  // }, [isFocused]);

  // console.log('moods', getMooda);
  let moods = [
    {name: 'sadness', icon: 'sad-tear', color: '#ff8c75'},
    {name: 'joy', icon: 'grin-stars', color: '#75ffe6'},
    {name: 'love', icon: 'grin-alt', color: '#8aff75'},
    {name: 'anger', icon: 'meh', color: '#ffd375'},
    {name: 'fear', icon: 'flushed', color: '#ffba75'},
    {name: 'surprise', icon: 'grin-beam', color: '#75ffb3'},
  ];
  return (
    <ScrollView style={{margin: 20}}>
        {moods.map(item => (
          <TouchableOpacity
            style={[
              styles.contentForm,
              {
                backgroundColor: colors.card,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
              style,
            ]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginRight: 60,
              }}>
              <Text caption2 light style={{marginBottom: 5}}>
                Mood
              </Text>
              <Text body1 semibold>
                {item.name}
              </Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View
                style={{
                  backgroundColor: item.color,
                  borderRadius: 30,
                  width: 50,
                  height: 50,
                  marginRight: 10,
                }}></View>
              <Icon
                name={item.icon}
                size={50}
                color={colors.primary}
                style={{textAlign: 'center'}}
              />
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

FormOption.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

FormOption.defaultProps = {
  style: {},
};
