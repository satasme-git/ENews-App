import React, { useState , useEffect , useContext, useRef  } from 'react';
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Pressable,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TextInput,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated
} from 'react-native';
import { styles, buttons } from './Styles';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import { useNavigation , useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {UserContext}  from '../context/Context';
import RBSheet from "react-native-raw-bottom-sheet";
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import { format } from 'date-fns'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
 
const IS_IPHONE_X = windowHeight === 812 || windowHeight === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

export default function SingleNews () {

  const refRBSheet = useRef();

  const [isModalVisible, setModalVisible] = useState(false);
  
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [image, setImage] = useState();
  const route = useRoute();
  
  const [comments, setComment] = useState( "");
  const [isLoading, setLoading] = useState(true);
  
  const [user, setUser] = useState('');
  const [udata, setUData] = useState([]);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  const lang = useContext(UserContext);

  const AnimatedHeaderValue = useRef(new Animated.Value(0)).current;
  const [color, setColor] = useState('white');
  const [statusbar, setStatusbar] = useState('light-content');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const getNews = () => {
    fetch(
      'https://enewstag.com/api/comment',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    // setRefreshing(false);
  };

  const getUser = () => {
    fetch(
      'https://enewstag.com/api/socialUser',
    )
      .then((response) => response.json())
      .then((json) => setUData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    // setRefreshing(false);
  };
  const onComment = (cm,nid,uid) =>{
    setLoading(true)
    const formData = new FormData()

    formData.append('comment', cm);
    formData.append('status', 'A');
    formData.append('datetime', format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    formData.append('news_id', nid);
    // formData.append('created_time', new Date());
    formData.append('user_id',uid );

    console.log(formData)
    
    fetch('https://enewstag.com/api/comment/', {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      getNews()
      // console.log('Success:', data);
    })
    .catch((error) => {
      getNews()
      // console.error('Error:', error);
    });
    setComment('');
    // Keyboard.dismiss();
    // getNews()
    getNews()

  }
  const {item} = route.params;

  const images = [
    image?
    {

        url: image,
    }:
    {
      props:{
        source:require('../assets/no.jpg'),
      },
    },
  ];

  // const animatedColor = AnimatedHeaderValue.interpolate(
  //   {
  //     inputRange: [ 0, ( windowHeight / 2.5 - 50 )  ],
  
  //     outputRange: [ 'white', 'black' ],
  
  //     extrapolate: 'clamp'
  //   });

  //   const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
  const renderNavBar = () => (
    <View style={{backgroundColor:'white',elevation:2,height:80}}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={{height: 75}}
        >
        <Text style={{fontSize:15,fontWeight:'bold',marginTop:35,marginLeft:50,width:windowWidth/1.5}} numberOfLines={2}> {item.title} </Text>
        </LinearGradient>
    </View>
  );
  
  const title = () => {
    return (
      <View style={styles.body}>
        <Animatable.View
        easing={'ease-in'}
        duration={600}
          animation={'fadeInDown'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: windowHeight / 2.5,
          }}>
            
          <Pressable onPress={() => {toggleModal(); setImage('https://enewstag.com/assets/news/images/'+item.image+'.jpg');}}>
            <ImageBackground
              source={ item.image ?{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}:require('../assets/no.jpg')}
              style={{
                width: windowWidth,
                height: windowHeight / 2.5,
                justifyContent: 'space-between',
              }}>
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={{height: 100}}
              />

                
              
              <Animatable.View
                animation={'fadeInUp'}
                delay={500}
                style={styles.imageInner}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Ionicons
                      name="eye"
                      size={15}
                      color="#000"
                    />
                  <Text style={styles.innerText}> {item.views}</Text>
                  </View>
                  <TouchableHighlight 
                  onPress={() => refRBSheet.current.open()} 
                  // onPress={()=>toggleModal2()}
                  underlayColor={'rgba(255,255,255,0.2)'}  style={{padding:3,borderRadius: 50,}}>
                    <Icon
                      name="commenting-o"
                      size={25}
                      color="#000"
                      // onPress={()=>toggleModal2()}
                    />
                  </TouchableHighlight>
                  
                  </View >
  
  
                  <View style={{flexDirection:'row',alignItems:'center',width:windowWidth-20,paddingRight:5}}> 
                    <View style={{backgroundColor:'#e12229',width:5,height:30,marginRight:5}}/>
                    <Text style={styles.singleHeaderText}> {item.title} </Text>
                  </View>
              </Animatable.View>
            </ImageBackground>
          </Pressable>
        </Animatable.View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView style={[styles.container, {margin: 10,paddingBottom:10}]}>
        <Text style={styles.singleInnerText}>{item.content.replace(/<\/?[^>]+(>|$)/g, ""  ).replace(/&quot;/g,'"').replace(/&zwj;/g,'').replace(/&ldquo;/g,'"').replace(/&rdquo;/g,'"').replace(/&rsquo;/g,`'`)} </Text>
        {/* <View style={{backgroundColor: 'gray',height:0.7,marginVertical:5}}  />
        <View style={{alignItems:'flex-end'}}>
          <Text style={{color:'gray',fontStyle:'italic'}} >Advertisment</Text>
          <Image source={require('../assets/1.jpg')} style={{width:500,height:45}}/>
        </View> */}

        


        <RBSheet
        ref={refRBSheet}
        keyboardAvoidingViewEnabled={true}
        // closeOnDragDown
        // closeOnPressMask={false}
        height={windowHeight/1.67}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "gray"
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            elevation:25
          }
        }}
      >
        
          <KeyboardAvoidingView 
            behavior={"padding"}
            keyboardVerticalOffset={20}
            style={{flex: 1
          }}>
            
<ScrollView style={{paddingHorizontal:10,marginBottom:0}}>
  <View style={{maxHeight:windowHeight*5}}>
<Text style={[styles.mainHeader,{alignSelf:'flex-start',paddingLeft:15}]}>Comments</Text>
        {
          isLoading==true?
        <Text>Loading..</Text>
        :    
        data.map((comment)=>
        <View key={comment.id}>
            {item.id==comment.news_id?
            <View style={{paddingVertical:10}} onLayout={()=>{setUserName(comment.user_id);setUserPhoto(comment.user_id)}}>
              <View style={{justifyContent: 'flex-start',flexDirection:'row'}}>
                {/* {setUserPhoto(comment.user_id)==null? */}
                {/* <View style={{height:25,width:25,borderRadius:20,backgroundColor: 'gray',}} /> */}
                <Image style={{height:25,width:25,marginRight:10}} source={require('../assets/user.png')}/>
                
                <View style={{width:windowWidth-60,borderRadius:2,borderWidth:1,borderColor:'#efefef',paddingHorizontal:7,paddingBottom:5,backgroundColor: '#fff',}}>
                  <Text style={[styles.headerText,{fontWeight:'bold',marginBottom:2}]}>{setUserName(comment.user_id)}</Text>
                  <Text style={[styles.headerText,{marginLeft:5}]}>{comment.comment}</Text>
                  <View style={{marginTop:5}}>
                    <Text style={[styles.innerText,{color: 'gray',}]}>{Moment(comment.datetime).format('D MMM yyyy')}</Text>
                  </View> 
                </View>
                
              </View>
              
              
            </View>
            :
            null
          }
          
          
        </View>

        )}
        </View>
        </ScrollView>

        
        {lang.logdata.length==0 ?
        <View style={{height:60,width:windowWidth,backgroundColor:'white',alignItems:'center',justifyContent: 'space-between',flexDirection:'row',borderTopWidth:0.2}} >
        <TouchableHighlight
          underlayColor={'#b2b2b2'}
          onPress={()=>{navigation.navigate('Login');refRBSheet.current.close()}}
          style={[styles.loginInput,{backgroundColor: '#eaeaea',width:windowWidth-60,justifyContent: 'center'}]}
        >
          <Text style={{color:'gray'}}>Log in to Comment</Text>
        </TouchableHighlight>
        <Ionicons
          name="send-sharp"
          size={30}
          color="#eaeaea"
          style={{marginLeft:5}}
        />
        
      </View>
        
        :
          <View style={{height:60,elevation:26,width:windowWidth,backgroundColor:'white',alignItems:'center',justifyContent: 'space-around',flexDirection:'row',borderTopWidth:0.2,}} >
            <TextInput
              style={[styles.loginInput,{backgroundColor: '#eaeaea',width:windowWidth-60}]}
              placeholder="Comment here.."
              onChangeText={(text) => setComment(text)}
              value={comments}
              keyboardType={'email-address'}
              textContentType={'emailAddress'}
            />
              {comments==''?
              <Ionicons
              name="send-sharp"
              size={30}
              color="#eaeaea"
              style={{marginLeft:5}}
              
            />:
            <TouchableHighlight underlayColor={'#b2b2b2'} style={{borderRadius:50}} onPress={()=>{onComment(comments,item.id,lang.logdata.id)}}>
              <Ionicons
              name="send-sharp"
              size={30}
              color="black"
              style={{marginLeft:5}}
              />
            </TouchableHighlight>
            
            }
              
            
            
          </View>
          }
        
        </KeyboardAvoidingView>
      </RBSheet>
        
      </ScrollView>
    );
  };
  
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

  function setUserName(input) {
    return (
      udata.map((item)=>
  {if (input==item.id){
    // console.log(item.email)
    return item.email;
    // setUser(item.email)
  }
  else {
return ''
    // setUser('User')
  }
}

  

  )
    )
  
   
  }

  function setUserPhoto(input) {
    return (
      udata.map((item)=>
  {if (input==item.id){
    // console.log(item.email)
    return item.profile_pic;
    // setUser(item.email)
  }
  else {
return '';
    // setUser('User')
  }
}

  

  )
    )
  
   
  }

  useEffect(() => {
    getNews();
    getUser();
    console.log( format(new Date(), "yyyy-MM-dd HH:mm:ss"))
  }, []);

  return (
    <View style={styles.container}>
      <ReactNativeParallaxHeader
        headerMinHeight={50}
        headerMaxHeight={windowHeight / 2.5}
        extraScrollHeight={20}
        navbarColor="transparent"
        titleStyle={styles.titleStyle}
        title={title()}
        alwaysShowTitle={false}
        alwaysShowNavBar={false}
        
        // backgroundImage={require('./bg.png')}
        backgroundImageScale={1.2}
        renderNavBar={renderNavBar}
        renderContent={renderContent}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        innerContainerStyle={styles.container}
        scrollViewProps={{
          // onMomentumScrollBegin: () => {setColor('black');setStatusbar('dark-content')},
          // onScrollEndDrag: () => {setColor('black');setStatusbar('dark-content')},
          // onMomentumScrollEnd: () => {setColor('white');setStatusbar('light-content')},
          // onScroll : ()=> { Animated.event(
          //   [{ nativeEvent: { contentOffset: { y: AnimatedHeaderValue }} }],
          //   {useNativeDriver: false}
          // )}
        }}
      />




      <StatusBar barStyle={statusbar} animated={true}/>
      <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isModalVisible}
      style={{flex:1,margin:0}}
      backdropOpacity={1}
      onBackButtonPress={()=>toggleModal()}
      >
        <StatusBar backgroundColor={'black'} translucent={true} animated={true}/>

        <Ionicons
        name="close"
        size={25}
        color="#fff"
        style={buttons.close}
        onPress={()=>toggleModal()}
      />
          <ImageViewer
          imageUrls={images}
          />
      </Modal>
      <Ionicons
        name="arrow-back"
        size={25}
        color={'white'}
        style={buttons.menu2}
        onPress={() => navigation.goBack()}
      />
              <View style={[buttons.close,{top:40}]}>
        <TouchableHighlight onPress={()=>{navigation.navigate('Categories');lang.setCategory(item.category_id);lang.setCatBack(true)}} style={[{backgroundColor: 'rgba(0,123,255,0.7)',padding:2,paddingHorizontal:4,borderRadius:7}]}>
          <Text style={[styles.innerText,{color:'rgba(255,255,255,0.75)'}]}>{setNewsCategory(item.category_id)}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

