import React from 'react';
import {
  Image, Keyboard, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import NavigationBarForEdit from '../../common/component/navigationBarForEdit';
import Text from '../../common/component/Text';
import { Colors, fontSize } from '../../common/constants';
import Utility from '../../common/utility';
import { kImage, kPDF } from './componentsMemoryDetails';

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
        <SafeAreaView style={{width: '100%', flex: 1, backgroundColor: '#fff'}}>
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <ScrollView>
            <TouchableOpacity onPress={() => this.navigateToViews()}>
              <View
                style={{
                  backgroundColor: '#F3F3F3',
                  width: '100%',
                  height: 200,
                }}>
                <Image
                  source={
                    this.props.type == 'pdf'
                      ? {uri: this.props.file.pdf_image_url}
                      : {uri: this.props.file.url}
                  }
                  style={{
                    height: '100%',
                    width: '100%',
                    resizeMode: 'contain',
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            </TouchableOpacity>
            <Text style={{...fontSize(16), marginTop: 5, padding: 15}}>
              {this.props.file.file_description}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
