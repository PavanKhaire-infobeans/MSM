import { Colors, fontFamily } from '../../constants';
import { bottomcalendar, clock, editOff, editOn, newMemory, ontimelineClickclock, promptOn, promptsOff, timelinecalendar } from './../../../../app/images'
const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {
  StyleSheet,
  Text,
  View,
  Animated,
  Image
} = ReactNative;
const Button = require('./Button');

const DefaultTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: Colors.black,
      inactiveTextColor: Colors.black,
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? Colors.bordercolor : Colors.newTextColor;
    const fontWeight = isTabActive ? '700' : '400';

    return <Button
      style={{ flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle,]}>
        {
          name == 'Recent' && isTabActive ?
            <Image style={{ height: 32, width: 32 }} source={name == 'Recent' ? isTabActive ? clock : ontimelineClickclock : isTabActive ? timelinecalendar : bottomcalendar} />
            :
            name == 'Edit' && isTabActive ?
              <Image source={editOn} />
              :
              name == 'Prompts' && isTabActive ?
                <Image source={promptOn} />
                :

                <Image style={name == 'New' ? { height: 56, width: 56, elevation: 3, shadowOpacity: 0.05, shadowColor: Colors.newDescTextColor, shadowRadius: 9, shadowOffset: { width: -2, height: 2 } } : {}} source={name == 'Recent' ? isTabActive ? clock : ontimelineClickclock : name == 'Edit' ? editOff : name == 'Prompts' ? promptsOff : name == 'New' ? newMemory : isTabActive ? timelinecalendar : bottomcalendar} />
        }
        <View style={{ height: 8 }} />
        <Text style={[{ color: textColor, fontWeight, fontFamily: fontFamily.Inter, fontSize: 17, lineHeight: 21.25 },]}>
          {name}
        </Text>
      </View>
    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    });
    return (
      <View style={[styles.tabs, this.props.style, { backgroundColor: this.props.backgroundColor, }]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                { translateX },
              ]
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 7,
  },
  tabs: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // paddingTop: 10,
    borderColor: Colors.white,
    width: '90%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 0,
    // borderTopColor: '#E2E4E9'
  },
});

module.exports = DefaultTabBar;
