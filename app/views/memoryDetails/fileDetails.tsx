import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from './../../../src/common/component/Text';
// import NavigationBar from '../dashboard/NavigationBar';
import NavigationBarForEdit from './../../../src/common/component/navigationBarForEdit';
import {Actions} from 'react-native-router-flux';
import {Colors, fontSize} from './../../../src/common/constants';
import {kImage, kAudio, kPDF} from './componentsMemoryDetails';
import Utility from '../../../src/common/utility';
import styles from './styles';

type Props = {[x: string]: any};
export default class FilesDetail extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  cancelAction = () => {
    Keyboard.dismiss();
    Actions.pop();
  };

  navigateToViews = () => {
    switch (this.props.type) {
      case kPDF:
        Actions.push('pdfViewer', {file: this.props.file});
        break;
      case kImage:
        Actions.push('imageViewer', {files: [this.props.file]});
        break;
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
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
          <ScrollView>
            <TouchableWithoutFeedback onPress={() => this.navigateToViews()}>
              <View
                style={styles.fileDetailsImageContainer}>
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
