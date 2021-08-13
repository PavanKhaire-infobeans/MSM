import React from 'react'
import { Text, View, Image, StatusBar } from 'react-native'
type Props = {communityInfo: {name: string, instanceURL?: string, instanceImage?: string }, style?: any, showSelection? : boolean, isSelected?: boolean}
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { Size, fontSize, Colors } from "../../common/constants";
import TextNew from '../../common/component/Text';
import { checkbox_active, checkbox } from '../../images';

const InstanceView = ({communityInfo, style, showSelection, isSelected}: Props) => {
    let name = communityInfo.name
    let url =  communityInfo.instanceURL == "192.168.2.6" ? "calpoly.cueback.com" : communityInfo.instanceURL
    let imageURL = communityInfo.instanceImage

    return (
        <View style={[styles.container, style]}>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.NewThemeColor}/>
            <View style={{flexDirection: "row", flex: 1}}>
                <View style={styles.imageContainer}><Image source={{ uri: imageURL }} style={styles.image} /></View>
                <View style={styles.innerContainer}>
                    <TextNew style={styles.name}>
                        {name}
                    </TextNew>

                    <TextNew style={styles.url}>
                        {url}
                    </TextNew>
                </View>
            </View>
            {showSelection && <Image style={{borderRadius: 5, tintColor: Colors.ThemeLight}} source={isSelected? checkbox_active : checkbox}></Image>}
        </View>
    );
} 

export default InstanceView;

const styles = EStyleSheet.create({
    $size: Size.byWidth(43),
    container: {
        padding: Size.byWidth(10),       
        borderWidth : 1,
        borderColor : "#EAE7DF",
        flexDirection: 'row',        
        backgroundColor: "#F4F1EA",        
        width: '100%',
        borderRadius: 8,        
        marginTop: 20,
        alignItems : "center",
        justifyContent: "space-between"
    },

    innerContainer: { 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: Size.byWidth(13),
        flex: 1
    },

    name: {
        fontStyle: "normal",
        ...fontSize(Size.byWidth(16)),
        color: 'black'
    },

    url: {
        fontStyle: "normal",
        ...fontSize(Size.byWidth(14)),
        marginTop: Size.byWidth(5),
        color: '#595959',
        textAlign: 'left'
    },
    imageContainer: {
        width: '$size',
        height: '$size',
        backgroundColor: Colors.NewLightThemeColor,
        justifyContent: 'center'
    },
    
    image: {
        width: '$size - 16',
        height: '$size - 16',        
        alignSelf: 'center'
    }
});