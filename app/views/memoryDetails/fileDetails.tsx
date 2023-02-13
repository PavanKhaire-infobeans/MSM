import React from 'react';
import {
  Image, Keyboard, SafeAreaView, ScrollView, StatusBar, TouchableWithoutFeedback, View
} from 'react-native';
import Text from './../../../src/common/component/Text';
// import NavigationBar from '../dashboard/NavigationBar';
import Utility from '../../../src/common/utility';
import NavigationBarForEdit from './../../../src/common/component/navigationBarForEdit';
import { Colors } from './../../../src/common/constants';
import { kImage, kPDF } from './componentsMemoryDetails';
import styles from './styles';

type Props = {[x: string]: any};
export default class FilesDetail extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  cancelAction = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };

  navigateToViews = () => {
    switch (this.props.type) {
      case kPDF:
        this.props.navigation.navigate('pdfViewer', {file: this.props.file});
        break;
      case kImage:
        this.props.navigation.navigate('imageViewer', {files: [this.props.file]});
        break;
    }
  };

  render() {
    return (
      <View style={styles.TitleAndValueContainer}>
        <NavigationBarForEdit
          heading={this.props.file.file_title}
          cancelAction={() => this.cancelAction()}
          rightText={false}
          saveValues={() => {}}
        />
        <SafeAreaView style={styles.fileDetailsContainer}>
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <ScrollView nestedScrollEnabled={true}    showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}overScrollMode='always'style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={() => this.navigateToViews()}>
              <View style={styles.fileDetailsImageContainer}>
                <Image
                  source={
                    this.props.type == 'pdf'
                      ? {uri: this.props.file.pdf_image_url}
                      : {uri: this.props.file.url}
                  }
                  style={styles.imageStyle}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.fileDescStyle}>
              {this.props.file.file_description}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
