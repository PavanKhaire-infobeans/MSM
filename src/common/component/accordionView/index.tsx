import React, { Component, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import { chevron_down } from '../../../images';
import Text from '../../../common/component/Text';
import styles from './styles';

const SECTIONS: [any] = [
  {
    title: 'What are MindPops?',
    content:
      'MindPops are inklings of memories that suddenly pop into your head. Quickly jot them down to write about later.',
    link: 'Learn more ways to add MindPops >',
  },
];

type Props = {
  sectionData: [any];
};

const AccordionView = (props: Props) => {
  const [state, setState] = useState({
    activeSections: [],
    sectionData: SECTIONS,
  });

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      sectionData: props.sectionData
    }))
  }, [props.sectionData]);

  const _renderHeader = (section: { [s: string]: any }) => {
    let imgStyle =
      state.activeSections.length == 0
        ? styles.chevronImageNormal
        : styles.chevronImage;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.textSize18}> {section.title}</Text>
        <Image source={chevron_down} style={imgStyle as any} />
      </View>
    );
  };

  const _renderContent = (section: { [s: string]: any }) => {
    return (
      <View style={styles.cellContainer}>
        <Text numberofLines={0} style={styles.textSize16}>
          {section.content}
        </Text>
        {/*<TouchableOpacity onPress={() => Actions.tipsAndTricks()}>
              <Text numberofLines={0} style={{ fontSize: 16, color: Colors.ThemeColor }}>{section.link}</Text>
            </TouchableOpacity>*/}
      </View>
    );
  };

  const _updateSections = (activeSections: [number]) => {
    setState(prevState => ({
      ...prevState,
      activeSections: activeSections
    }))
  };

  return (
    <Accordion
      touchableComponent={TouchableWithoutFeedback}
      sections={props.sectionData}
      activeSections={state.activeSections}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={_updateSections}
    />
  );

}

export default AccordionView;