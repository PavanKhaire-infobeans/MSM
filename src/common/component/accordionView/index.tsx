import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { chevron_down } from '../../../images';
import Text from '../../../common/component/Text';
import { Size, fontSize, Colors } from '../../constants';
import { Actions } from 'react-native-router-flux';


const SECTIONS: [any] = [
  {
    title: 'What are MindPops?',
    content: 'MindPops are inklings of memories that suddenly pop into your head. Quickly jot them down to write about later.',
    link: 'Learn more ways to add MindPops >'
  },
];

type Props = {
  sectionData: [any],
}

export default class AccordionView extends Component<Props, { [x: string]: any }> {


  state: { activeSections: number[], sectionData: any[] } = {
    activeSections: [],
    sectionData: SECTIONS
  };

  componentWillReceiveProps(props: Props) {
    this.setState({ sectionData: props.sectionData })
  }

  _renderHeader = (section: { [s: string]: any }) => {
    let imgStyle = (this.state.activeSections.length == 0) ? styles.chevronImageNormal : styles.chevronImage
    return (
      <View style={styles.headerContainer}>
        <Text style={fontSize(18)}> {section.title}</Text>
        <Image source={chevron_down} style={imgStyle as any} />
      </View>
    );
  };

  _renderContent = (section: { [s: string]: any }) => {
    return (
      <View style={styles.cellContainer}>
        <Text numberofLines={0} style={fontSize(16)}>{section.content}</Text>
        {/*<TouchableOpacity onPress={() => Actions.tipsAndTricks()}>
          <Text numberofLines={0} style={{ fontSize: 16, color: Colors.ThemeColor }}>{section.link}</Text>
    </TouchableOpacity>*/}
      </View>
    );
  };

  _updateSections = (activeSections: [number]) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        touchableComponent={TouchableWithoutFeedback}
        sections={this.props.sectionData}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors.NewLightThemeColor,
    borderBottomWidth: 1,
    elevation : 2,
    shadowOpacity: 1,
    shadowColor: Colors.NewLightThemeColor,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 2,
    height: 46,
  },

  cellContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#E6F0EF',
    justifyContent: 'space-around',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    shadowOpacity: 1,
    elevation : 2,
    shadowColor: '#D9D9D9',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 16,
    height: 90,
  },

  chevronImage: {
    transform: [{ rotate: '180deg' }]
  },

  chevronImageNormal: {
    transform: [{ rotate: '0deg' }]
  }
})