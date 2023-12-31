import React, {useEffect, useState} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text, Icon, Card, Button, SafeAreaView} from '@components';
import {Images, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiList, {serverIp} from '../../apiList';
import Cover from '../CareCover.png';
import ChatBot from 'react-native-chatbot-expo';
export default function Home({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const moodStatus = useSelector(state => state.application);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState([
    {
      name: 'Jogging',
      mood: 'relaxed',
      description:
        'Jogging is an relaxing axtivity for enthusastic individuals',
      image: `${serverIp}/host/images/130931e4-0519-4fd0-94f5-5eb84acb7447.jpg`,
    },
    {
      name: 'Running',
      mood: 'joy',
      description: 'Running is an Joyful axtivity for enthusastic individuals',
      image: `${serverIp}/host/images/130931e4-0519-4fd0-94f5-5eb84acb7447.jpg`,
    },
    {
      name: 'Reading',
      mood: 'calm',
      description: 'reading is an calm axtivity for intellect individuals',
      image: `${serverIp}/host/images/130931e4-0519-4fd0-94f5-5eb84acb7447.jpg`,
    },
  ]);
  const steps = [
    {
      id: '1',
      message: 'What is your name?',
      trigger: '2',
    },
    {
      id: '2',
      user: true,
      trigger: '3',
    },
    {
      id: '3',
      message: 'Hi {previousValue}, nice to meet you!',
      end: true,
    },
  ];
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  const getDailyData = async () => {
    try {
      const id = await AsyncStorage.getItem('@storage_Key_id');
      if (id !== null) {
        axios
          .get(apiList.GetDailyData + `/${id}`)
          .then(res => {
            setResult(res.data.item.score);
            // console.log("RES->>> >>> >>> ", res.data.item.score.mood);
          })
          .catch(e => console.log(e));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getActivities = () => {
    axios
      .get(apiList.GetDisplayActivity)
      .then(res => {
        // console.log('activities-> ', res.data);
        setActivities(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const renderIconService = () => {
    /* [sad-cry,sad-tear,frown,flushed,meh,smile,smile-beam,grin-alt,grin-beam,grin-stars] */
    // moods enum=[depressed,stressed,upset,tense,fatigued,calm,relaxed,happy,excited,joy]

    switch (result ? result.mood : '') {
      case 'sadness':
        return 'sad-tear';
        break;
      case 'love':
        return 'grin-alt';
        break;
      case 'anger':
        return 'meh';
        break;
      case 'fear':
        return 'flushed';
        break;
      case 'surprise':
        return 'grin-beam';
        break;
      case 'joy':
        return 'grin-stars';
        break;
      default:
        return 'heart';
    }
  };

  const heightImageBanner = Utils.scaleWithPixel(140);
  const marginTopBanner = heightImageBanner - heightHeader;

  useEffect(() => {
    getActivities();
  }, []);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getDailyData();
    });
    return focusHandler;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={Cover}
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(100),
                Utils.scaleWithPixel(100),
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          },
        ]}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
        <FlatList
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
          ListHeaderComponent={
            <View style={{paddingHorizontal: 20}}>
              <View
                style={[
                  styles.searchForm,
                  {
                    marginTop: marginTopBanner,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    shadowColor: colors.border,
                  },
                ]}>
                <Text semibold style={styles.titleView}>
                  {result
                    ? 'Mood according to last quiz'
                    : 'Please take a quiz'}
                </Text>
                <Icon
                  name={renderIconService()}
                  size={100}
                  color={colors.primary}
                  style={{textAlign: 'center'}}
                />
                <Text title3 semibold style={{textAlign: 'center'}}>
                  {result !== null ? result.mood : ''}
                </Text>
                <Text style={styles.titleView}>
                  Following are some activities that should boost your mood
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <View>
                <Text title3 semibold style={{paddingLeft: 20}}>
                  {t('Recomended')}
                </Text>
                <Text body2 grayColor style={{paddingLeft: 20}}>
                  {t('Recomended for everyone')}
                </Text>
                <FlatList
                  contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={activities}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({item, index}) => {
                    const ImgUri = item?.image?.toString()?.replace(/"/g, '');
                    // console.log(ImgUri);
                    return (
                      <Card
                        style={[styles.promotionItem]}
                        image={ImgUri}
                        onPress={() =>
                          navigation.navigate('Event', {activity: item})
                        }>
                        <Text subhead whiteColor>
                          Recomenended Activity
                        </Text>
                        <Text title2 whiteColor semibold>
                          {item.name}
                        </Text>
                        <View style={styles.contentCartPromotion}>
                          <Button
                            style={styles.btnPromotion}
                            onPress={() =>
                              navigation.navigate('Event', {activity: item})
                            }>
                            <Text body2 semibold whiteColor>
                              More Details
                            </Text>
                          </Button>
                        </View>
                      </Card>
                    );
                  }}
                />
              </View>
              {/* Hiking */}
              <View>
                <Text title3 semibold style={{paddingLeft: 20}}>
                  {t('Helpful With Mood')}
                </Text>
                <Text body2 grayColor style={{paddingLeft: 20}}>
                  {t('this will boost your mood')}
                </Text>
                <FlatList
                  contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={activities}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({item, index}) => {
                    const ImgUri = item?.image?.toString()?.replace(/"/g, '');
                    // console.log(ImgUri);
                    return (
                      <Card
                        style={[styles.promotionItem]}
                        image={ImgUri}
                        onPress={() =>
                          navigation.navigate('Event', {activity: item})
                        }>
                        <Text subhead whiteColor>
                          Recomenended Activity
                        </Text>
                        <Text title2 whiteColor semibold>
                          {item.name}
                        </Text>
                        <View style={styles.contentCartPromotion}>
                          <Button
                            style={styles.btnPromotion}
                            onPress={() =>
                              navigation.navigate('Event', {activity: item})
                            }>
                            <Text body2 semibold whiteColor>
                              More Details
                            </Text>
                          </Button>
                        </View>
                      </Card>
                    );
                  }}
                />
              </View>
            </View>
          }
        />
        <View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={styles.chatBtn}>
            <Text body2 semibold whiteColor>
              Chat
            </Text>
            <Icon name={'comment'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>
        <Modal
          style={{padding: 0, margin: 0,backgroundColor: 'rgba(0,0,0,0.5)'}}
          onBackdropPress={()=>{
            console.log("press");
            setModalVisible(false)
          }}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          {/* <TouchableOpacity> */}
          {/* <View style={{backgroundColor:'green'}}> */}
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Icon name={'times'} size={20} color={colors.black} />
              </Pressable>
              <ChatBot steps={steps} />
            </View>
          {/* </View> */}
          {/* </TouchableOpacity> */}
        </Modal>
      </SafeAreaView>
    </View>
  );
}
