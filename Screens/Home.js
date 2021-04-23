import React, { useState, useEffect , useContext} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {styles, buttons} from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {DrawerActions} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {UserContext}  from '../context/Context';

import News from './News';
import Videos from './Videos';
import Trending from "./Trending";
import Suggest from "./Suggest";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({navigation}) {
  const [breaking, setBreaking] = useState('');
  const [language, setLanguage] = useState();
  const [logged, setLogged] = useState();
  const [isLoading, setLoading] = useState(true);

  
  const [filtedData, setFilltedData] = useState([]);
  const [data, setData] = useState([]);

  const lang = useContext(UserContext);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('lang');
      if (value !== null) {
        setLanguage(value);
      }
    } catch (e) {}
  };

  const getLogData = async () => {
    try {
      const data = await AsyncStorage.getItem('log');
      if (data !== null) {
        setLogged(data);
      }
    } catch (e) {}
  };

  const getNewsData = () => {
    fetch(
      'https://enewstag.com/api/news/',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {setError(true)})
      .finally(() => {setLoading(false);});
    // setRefreshing(false);
    
  };

  function filtedDataArray() {
    // getData()
    var filted = new Array()
    data.map((item,index) => {
      lang.lang==item.language && item.type =='Breaking_News'?(
        filted.push(item)
      ):(null)
    })
    lang.setBreaking(filted.pop());
    // console.log(filted.pop())
  }
  


  useEffect(() => {
    getData();
    getLogData();
    // console.log(lang.acc);
    getNewsData()
    filtedDataArray()
    // getLastBreaking();
  }, []);


  return (
    <View style={styles.container} onLayout={()=>filtedDataArray()}>
      <StatusBar barStyle={'dark-content'}/>
      
      <TouchableHighlight underlayColor="#DDDDDD" style={[styles.searchBarView,{padding: 0,marginTop:35,backgroundColor:'#eaeaea',height:30}]} onPress={()=>{navigation.navigate('Search')}} >
        <View style={{justifyContent: 'space-between',flexDirection:'row',alignItems:'center'}}>
          <View style={[styles.searchBarInput]}>
          <Text style={{color: 'gray',fontSize:14}}>Looking for..</Text>
          </View>
        <Icon
          name="search"
          size={18}
          color={'gray'}
        />
        </View>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="#DDDDDD" style={{flexDirection:'row',backgroundColor: 'white',paddingVertical:0,alignItems:'center',width:windowWidth}} onPress={()=>{navigation.navigate('Single', {item: lang.breaking})}}>
       <View  style={{flexDirection:'row',paddingHorizontal:10,paddingBottom:5,alignItems:'center',width:windowWidth}} onLayout={()=>filtedDataArray()}>
         
        <Animatable.View 
        // style={{alignSelf:'center'}}  
        animation="pulse" easing="ease-out" iterationCount="infinite">
               <View style={{backgroundColor: '#e12229',height:1.7,marginVertical:2}}  /> 
       <Image style={{height:15,width:40,tintColor:'#e12229' }} source={require('../assets/breaking.png')}/>
       <View style={{backgroundColor: '#e12229',height:1.5,marginVertical:2}}  />
        </Animatable.View>
        
        <Text style={{paddingHorizontal:10,width:windowWidth-60,fontSize:13}}>{lang.breaking==null?filtedDataArray():lang.breaking.title}</Text>
       </View>

      </TouchableHighlight>


      <View/>
      <Icon
        name="navicon"
        size={20}
        color="#000"
        style={buttons.menu}
        onPress={() => {navigation.dispatch(DrawerActions.openDrawer());Keyboard.dismiss()}}
      />
     
      <Tab.Navigator
      lazy={true}
        tabBarOptions={{
          activeTintColor: '#000000',
          inactiveTintColor: '#bcbcbc',
          scrollEnabled: true,
          // tabStyle: { width: 'auto'},
          style: {backgroundColor: 'white', elevation: 5,marginTop:-10},
          labelStyle: {
            fontSize: 16,
            textTransform: 'capitalize',
            fontFamily: 'sans-serif-medium',
          },
          indicatorStyle :{
            backgroundColor:'#e12229',
            height:4,
            // margin:5,
            // borderRadius:10
          }
          // renderIndicator: (props) => {
          //   return <View />;
          // },
        }}>
        <Tab.Screen name="Latest news" component={NewsScreen} />
        <Tab.Screen name="Popular news" component={TrendingScreen} />
        <Tab.Screen name="Suggest news" component={SuggestScreen} />
        {/* <Tab.Screen name="Videos" component={VideosScreen} /> */}
      </Tab.Navigator>
    </View>
  );
}

function NewsScreen({navigation}) {
  return <News />;
}

function VideosScreen({navigation}) {
  return <Videos />;
}
function TrendingScreen({navigation}) {
  return <Trending />;
}

function SuggestScreen({navigation}) {
  return <Suggest />;
}