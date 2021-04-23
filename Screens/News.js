import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {styles} from './Styles';
import {useNavigation} from '@react-navigation/native';
import {Dummy} from "./Dummy";
import Shimmer from 'react-native-shimmer';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import {UserContext}  from '../context/Context';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function News() {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [language, setLanguage] = useState();
  const [id, setId] = useState();
  const [error, setError] = useState(false );
  const [filtedData, setFilltedData] = useState([]);
  
  const [view, setView] = useState('');

  const lang = useContext(UserContext);

  const onRefresh = () => {
    setRefreshing(true);
    setData([]);
    getData();
    setError(false)
    setLoading(true)
    filtedDataArray()
  };

  const getLanguageData = async () => {
    try {
      const value = await AsyncStorage.getItem('lang');
      if(value !== null) {
        setLanguage(value);
      }
    } catch(e) {
    }
  };

  const getData = () => {
    fetch(
      'https://enewstag.com/api/news/',
    )
      .then((response) => response.json())
      .then((json) => setData(json.reverse()))
      .catch((error) => {setError(true)})
      .finally(() => {setLoading(false);});
    setRefreshing(false);
    
  };

  useEffect(() => {
    getLanguageData();
    
    getData();
    filtedDataArray()
    return () => {
      getData();
      getLanguageData();
      filtedDataArray()
    }
    // setData(reverseArr(data))
    
  }, []);

  function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

function filtedDataArray() {
  // getData()
  var filted = new Array()
  data.map((item,index) => {
    lang.lang==item.language?(
      filted.push(item)
    ):(null)
  })
  setRefreshing(false);

  setFilltedData(filted);

    let newsid = 0

    filtedData.map((menu,index) => {
      index==0?(
        newsid=(menu.id)
      ):(null)
    })
    setId(newsid)
  
}
  
// const quantityPlus=(item)=>{
//   let q=item.quantity++
//   setQty(q-2)
// }

const viewCounter = (item) =>{
  const formData = new FormData()
  console.log(item.views,item.id)
  let views=item.views++
  // setView(views)
  // formData.append('views', views);
  const data = {views: views+1};


  
  fetch('https://enewstag.com/api/news/'+item.id+'', {
    method: 'PUT', // or 'PUT'
    headers: {
      'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  // .then(response => console.log(response.json()))
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error, JSON.stringify(data));
  });



} 

function setNewsCategory(input) {
  if (input=='1'){
    return 'World';
  }
  else if (input=='2'){
    return 'Politics';
  }
  else if (input=='3'){
    return 'Business';
  }
  else if (input=='4'){
    return 'Health';
  }
  else if (input=='5'){
    return 'Entertainment';
  }
  else if (input=='6'){
    return 'Style';
  }
  else if (input=='7'){
    return 'Travel';
  }
  else if (input=='8'){
    return 'Sports';
  }
}

  return (
    <View style={styles.containerInner}>
      {error == true?
        <ScrollView contentContainerStyle={{height:windowHeight-150,justifyContent: 'center',alignItems:'center'}} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#e12229'} />}
        >
          <Image source={require('../assets/error.png')} style={{width:80,height:80,tintColor:'rgba(178,178,178,0.7)'}}/>
        <Text style={styles.drawerText}>Network Error</Text>
        <TouchableOpacity onPress={()=>onRefresh()} style={{backgroundColor:'red',padding:5,paddingHorizontal:7,borderRadius:8}}>
          <Text style={{color:'white'}}>Refresh</Text>
        </TouchableOpacity>
        </ScrollView>
        :

      isLoading && data.length == 0? (
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <FlatList
            data={Dummy}
            keyExtractor={({id}, index) => id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              item.id==1?
              <TouchableHighlight
                style={{padding: 0}}
                underlayColor="#DDDDDD"
                onPress={() => navigation.navigate('Single', {item: item})}>
                  <View style={{backgroundColor:'white',marginBottom:1,padding:5}} >
                  <Shimmer opacity={0.85} duration={1200}>
                    <View style={[styles.thumbnail,{backgroundColor:'#cfcfcf'}]}/>
                  </Shimmer>
                    
                    <View style={{padding:5}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:3}}>
                    <Shimmer opacity={0.85} duration={1000}>
                        <View style={{backgroundColor:'#e3e3e3',height:11,width:40,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>


                      <Shimmer opacity={0.85} duration={1000}>
                        <View style={{backgroundColor:'#e3e3e3',height:11,width:60,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>
                    </View>
                      
                      <View style={{height:40,justifyContent: 'space-evenly',}}>
                        <Shimmer opacity={0.85} duration={1200}>
                          <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                        </Shimmer>
                        <Shimmer opacity={0.85} duration={1150}>
                          <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                        </Shimmer>
                      </View>
                      <View style={{alignSelf:'flex-start',paddingTop:5}}>
                        <Shimmer opacity={0.85} duration={1000}>
                            <View style={{backgroundColor:'rgba(225,34,41,0.3)',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>
                      </View>
                      
                    </View>
                  </View>
              </TouchableHighlight>
              :
                <View style={styles.newsContainer}>
                  <Shimmer opacity={0.9} duration={1000}>
                    <View style={[styles.image,{backgroundColor:'#cfcfcf'}]}/>
                  </Shimmer>
                  <View style={[styles.newsInnerContainer]}>
                    <View style={{height:70,justifyContent: 'space-evenly',}}>
                      <Shimmer opacity={0.85} duration={1200}>
                        <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                      </Shimmer>
                      <Shimmer opacity={0.85} duration={1150}>
                        <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                      </Shimmer>
                      <Shimmer opacity={0.85} duration={1100}>
                        <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                      </Shimmer>
                    </View>
                    
                    <View style={{height:30,marginBottom:4,justifyContent: 'space-between',}}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Shimmer opacity={0.85} duration={1000}>
                        <View style={{backgroundColor:'#e3e3e3',height:11,width:40,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>
                      </View>
                      <View style={{alignSelf:'flex-end',width:windowWidth - 135,flexDirection:'row',justifyContent: 'space-between'}}>
                        <Shimmer opacity={0.85} duration={1000}>
                          <View style={{backgroundColor:'rgba(225,34,41,0.3)',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>
                        <Shimmer opacity={0.85} duration={1000}>
                          <View style={{backgroundColor:'#e3e3e3',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                        </Shimmer>
                      </View>
                    </View>
                  </View>
                  
                </View>
            )}
          />
        </View>
      ) : (
        <View style={{flex: 1,flexDirection: 'column',justifyContent: 'space-between',paddingHorizontal: 0}}>
          <FlatList
            refreshing={true}
            data={data}
            keyExtractor={({id}, index) => id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
            renderItem={({item}) => (
              
              lang.lang==item.language?
              item.id==id?
              <TouchableHighlight
                style={{padding: 0}}
                underlayColor="#DDDDDD"
                onPress={() => {navigation.navigate('Single', {item: item});viewCounter(item)}}>
                  <View style={{backgroundColor:'white',marginBottom:1.5,padding:5}} >
                    <Image style={styles.thumbnail} source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}}/>
                    <View style={{padding:5}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Ionicons
                          name="eye"
                          size={18}
                          color="gray"
                        />
                        <Text style={[styles.innerText,{color:'gray'}]}> {item.views}</Text>
                      </View>
                      <Text style={styles.innerText}>{item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy')}</Text>
                    </View>
                      
                      <Text style={[styles.headerText]} numberOfLines={3}>{item.title}</Text>
                      <Text style={[styles.innerText,{color:'#e12229'}]}>{setNewsCategory(item.category_id)}</Text>
                    </View>
                  </View>

                  
              </TouchableHighlight>
              :
              <TouchableHighlight
                style={{padding: 0}}
                underlayColor="#DDDDDD"
                onPress={() => {navigation.navigate('Single', {item: item});viewCounter(item)}}>
                <View style={styles.newsContainer} onLayout={()=>filtedDataArray()}>
                  {item.image ?
                  <Image source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}} style={styles.image} /> :
                  <Image source={require('../assets/no.jpg')} style={styles.image} />
                }
                  <View style={[styles.newsInnerContainer]}>
                    <Text style={[styles.headerText]} numberOfLines={3}>{item.title}</Text>
                    <View>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Ionicons
                          name="eye"
                          size={18}
                          color="gray"
                        />
                        <Text style={[styles.innerText,{color:'gray'}]}> {item.views}</Text>
                        {/* <Text>{id}</Text> */}
                      </View>
                      <View style={{alignSelf:'flex-end',width:windowWidth - 135,flexDirection:'row',justifyContent: 'space-between'}}>
                        <Text style={[styles.innerText,{color:'#e12229'}]}>{setNewsCategory(item.category_id)}</Text>
                        <Text style={styles.innerText}>{item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy')}</Text>
                      </View>
                    </View>
                    
                  </View>
                </View>
              </TouchableHighlight>
              :null
            )}
          />
        </View>
      )
      
      }

    </View>
  );
}
