import React, { Component } from 'react';
import { Platform } from 'react-native';

import { 
  PanResponder,
  Animated,
  Dimensions,
  StyleSheet,
  Easing
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

import {Direction} from '../../../../views/registration/prologue'

export default class Animator extends Component{
  position = 0;
  constructor(props){
    super(props);
    
    this.position = new Animated.ValueXY(this.props.currentPosition);

    this._panResponder = PanResponder.create({      
      onStartShouldSetPanResponder: () => true,      
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease
    });
  }

  render() {
    return (
      <Animated.View 
        style={[
          {...this.position.getLayout(), left: 0},
          StyleSheet.flatten([
            styles.animationContainer(this.props.containerHeight, this.props.backgroundColor),
            styles.roundedEdges(this.props.roundedEdges),
            styles.shadow(this.props.shadow)
          ])
        ]}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
      </Animated.View>
    )
  }

  _handlePanResponderMove = (e, gesture) => {    
    if (this._swipeInBounds(gesture)) {
      if(gesture.dy > 0){
        this.props.panResponderMove(e, gesture, Direction.downDirection);
      } else{
        this.props.panResponderMove(e, gesture, Direction.upDirection);
      }
      this.position.setValue({ y: this.props.currentPosition.y + gesture.dy });      
    } else {      
      if(gesture.dy > 0){
        this.props.panResponderMove(e, gesture, Direction.downDirection);
      } else{
        this.props.panResponderMove(e, gesture, Direction.upDirection);
      }      
      this.position.setValue({ y: this.props.upPosition.y - this._calculateEase(gesture) });
    }
  }

  _handlePanResponderRelease = (e, gesture) => {    
    if (gesture.dy > this.props.toggleThreshold && this.props.currentPosition === this.props.upPosition) {
      this.props.responseRelease(e, gesture, this.props.identifier, Direction.downDirection)
      this.collapse();
    } else if (gesture.dy < -this.props.toggleThreshold && this.props.currentPosition === this.props.downPosition) {      
      this.props.responseRelease(e, gesture, Direction.upDirection);    
      this.expand();
    } else if(gesture.dy < 3){
      this.props.drawerTapped();
    }     
    else {
      this.props.responseRelease(e, gesture, Direction.reset);    
      this._resetPosition();
    }
  }

  // returns true if the swipe is within the height of the drawer.
  _swipeInBounds(gesture) {
    return this.props.currentPosition.y + gesture.dy > this.props.upPosition.y;
  }

  _calculateEase(gesture) {
    return Math.min(Math.sqrt(gesture.dy * -1), Math.sqrt(SCREEN_HEIGHT));
  }

  _transitionTo(position) {
    Animated.spring(this.position, {
      toValue: position,
      speed: 6,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.props.onExpanded);    
    this.props.setCurrentPosition(position);
  }

  collapse=()=>{
    this._transitionTo(this.props.downPosition);    
    this.props.onCollapsed()
  }

  expand=()=>{
    this._transitionTo(this.props.upPosition);
    this.props.onExpanded()
  }

  _resetPosition() {
    Animated.spring(this.position, {
      toValue: this.props.currentPosition,
      speed: 6,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();    
  }
}

const styles = {
  animationContainer: (height, color) => ({
    width: SCREEN_WIDTH,
    position: 'absolute',
    height: height + Math.sqrt(SCREEN_HEIGHT),
    backgroundColor: color,
  }),
  roundedEdges: rounded => {
    return rounded == true && {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }
  },
  shadow: shadow => {
    return shadow == true && {
      ...Platform.select({
        ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 1,
            borderWidth : 0.5,
            borderColor : "#ccccccaa"
        },
        android: {
            elevation: 1,
            borderWidth : 0.5,
            borderColor : "#ccccccaa"
        },
      })
    }
  },
}