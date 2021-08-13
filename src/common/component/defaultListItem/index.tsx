import React from 'react';
import { TouchableOpacity, ViewStyle, View, Image, TouchableHighlight, Platform } from 'react-native';
import Text from '../../component/Text';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { fontSize, Colors } from '../../constants';
import {icon_arrow} from '../../../images'
//80B762
const styles = EStyleSheet.create({
  container:{flexDirection: 'row', marginLeft: 16, marginRight: 16,
            borderBottomColor: "#909090", minHeight: 65, paddingTop: 10, paddingBottom: 10,
            justifyContent: "space-between", alignItems: 'center'},
  notificationCountBG:{marginRight: 15, backgroundColor: Colors.NewRadColor, 
                      paddingLeft: 10, paddingRight: 10, paddingTop: 1, 
                      paddingBottom: 1, borderRadius: 10},
  notificationCountText:{fontSize: 16, textAlign: "center", color: "#FFFFFF", fontWeight: Platform.OS === "ios"? '500':'bold'}
});

type Props = {
  title : string,
  showArrow? : boolean,
  icon? : any,
  count : number,
  identifier : string,
  isLast? : boolean,
  subTitle?: string
  onPress?: (key: any) => void
}

export default class DefaultListItem extends React.Component<Props>{
  static defaultProps : Props = {
    title : "",
    showArrow : true,
    count : 0,
    identifier : "",
    isLast : false,
    onPress : () => { }
  }

  render() {
    //console.log("Key is " + this.props.identifier);
    return (
      <TouchableHighlight underlayColor="#cccccc3e" style={{width: '100%'}} onPress={() => this.props.onPress(this.props.identifier)}>
          <View style={[styles.container, {borderBottomWidth: (this.props.isLast ? 0 : 1)}]}>
                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex : 1}}>
                    {this.props.icon &&
                        <Image style={{width: 24, height: 24, resizeMode:'center',  marginRight: 15}} source={this.props.icon}/>
                    }
                    <View style={{flexDirection: "column", paddingRight: 10, flex : 1}}>
                        <Text style={{...fontSize(18),color: Colors.TextColor}}>{this.props.title}</Text>        
                        {this.props.subTitle && <Text style={{paddingTop: 5, color: Colors.TextColor,...fontSize(14)}}>{this.props.subTitle}</Text>}
                    </View>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  {this.props.count > 0 &&
                    <View style={styles.notificationCountBG}>
                        <Text style={styles.notificationCountText}>{this.props.count}</Text>
                    </View>}
                    {this.props.showArrow && <Image source={icon_arrow}/>}
                </View>
          </View>
      </TouchableHighlight>
    );
  }
}

