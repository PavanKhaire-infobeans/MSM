import React from 'react'
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import Text from '../Text';
import { View, Image } from 'react-native';
import { Size, fontSize } from '../../constants';
import { UserData } from '../../loginStore/database';

const styles = EStyleSheet.create({
    $size: Size.byWidth(43),
    container: {
        borderRadius: 5,
        borderColor:"rgb(230,230,230)",
        borderWidth: 2,
        padding: Size.byWidth(16),
        flexDirection: 'row',
        shadowOpacity: 0.75,
        elevation : 1,
        shadowRadius: 5,
        shadowColor: 'rgb(210,210,210)',
        shadowOffset: { height: 0, width: 1 },
        width: '100%'
    },

    innerContainer: { 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: Size.byWidth(13)
    },

    name: {
        fontStyle: "normal",
        ...fontSize(Size.byWidth(16)),
        color: 'black',
        textAlign: 'left'
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
        backgroundColor: "#F3F3F3",
        justifyContent: 'center'
    },
    
    image: {
        width: '$size - 16',
        height: '$size - 16',        
        alignSelf: 'center'
    }
});

type Props = {communityInfo: UserData, style?: any}

const CommunityBanner = ({communityInfo, style}: Props) => {
    let name = communityInfo.name
    let url =  communityInfo.instanceURL == "192.168.2.6" ? "calpoly.cueback.com" : communityInfo.instanceURL
    let imageURL = communityInfo.instanceImage

    return (
        <View style={style || styles.container}>
            <View style={styles.imageContainer}><Rounded imageURL={imageURL} style={styles.image} /></View>
            <View style={styles.innerContainer}>
                <Text style={styles.name}>
                    {name}
                </Text>

                <Text style={styles.url}>
                    {url}
                </Text>
            </View>
        </View>
    );
}

const Rounded = (props: {[x: string]: any}) => {
    return <Image source={{ uri: props.imageURL }} style={props.style} />
}


export default CommunityBanner;