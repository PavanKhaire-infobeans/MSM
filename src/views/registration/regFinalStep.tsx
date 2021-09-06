import React, {Component} from 'react';
import {SafeAreaView, View, StatusBar, Keyboard} from 'react-native';
import Text from '../../common/component/Text';
import {connect} from 'react-redux';
import InstanceView from './instanceView';
import {Account} from '../../common/loginStore';
//@ts-ignore
import {KeyboardAwareScrollView} from '../../common/component/keyboardaware-scrollview';
import {SubmitButton} from '../../common/component/button';
import TextField from '../../common/component/textField';
import {Size, fontSize, Colors} from '../../common/constants';
import {Actions} from 'react-native-router-flux';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import {backBlkBtn} from '../../images';
import EStyleSheet from 'react-native-extended-stylesheet';

export class RegFinalStep extends Component {
  navBar: NavigationHeaderSafeArea;
  state = {
    fromYear: '',
    toYear: '',
    major: '',
    minor: '',
    degree: '',
    error: {
      fromYear: {
        error: false,
        message: '',
      },
      toYear: {
        error: false,
        message: '',
      },
      major: {
        error: false,
        message: '',
      },
      minor: {
        error: false,
        message: '',
      },
      degree: {
        error: false,
        message: '',
      },
    },
  };
  render() {
    let accData = Account.tempData();
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
          <NavigationHeaderSafeArea
            isRegisteration={true}
            ref={ref => (this.navBar = ref)}
          />
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="s"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
            }}
            contentContainerStyle={{alignItems: 'center'}}
            bounces={false}>
            <View style={{width: 310, paddingBottom: 40}}>
              {/* <InstanceView
							communityInfo={{ instanceURL: accData.instanceURL, instanceImage: accData.instanceImage, name: accData.name }}
							style={{
								borderRadius: 5, borderBottomColor: "rgb(230,230,230)",
								borderBottomWidth: 2, borderTopColor: "rgb(230,230,230)",
								borderTopWidth: 2, marginBottom: 24,
								marginTop: 32
							}}
						/> */}
              <Text
                style={{
                  textAlign: 'center',
                  width: '100%',
                  lineHeight: 26,
                  ...fontSize(18),
                  marginBottom: 24,
                }}>
                We need some additional information to provide you a better
                experience.
              </Text>
              <Text
                style={{
                  width: '100%',
                  lineHeight: 26,
                  ...fontSize(18),
                  color: '#6B6B6B',
                  marginBottom: 1,
                }}>{`Years you were at ${Account.tempData().name}`}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 15,
                }}>
                <TextField
                  style={{width: '45%'}}
                  placeholder={'From'}
                  value={this.state.fromYear}
                  showError={this.state.error.fromYear.error}
                  errorMessage={this.state.error.fromYear.message}
                  returnKeyType="next"
                  onChange={(text: string) => {
                    this.setState({
                      fromYear: text,
                      error: {
                        ...this.state.error,
                        fromYear: {error: false, message: ''},
                      },
                    });
                    this.navBar._hide();
                  }}
                />
                <TextField
                  style={{width: '45%', position: 'absolute', right: 0}}
                  placeholder={'To'}
                  value={this.state.toYear}
                  showError={this.state.error.toYear.error}
                  errorMessage={this.state.error.toYear.message}
                  returnKeyType="next"
                  onChange={(text: string) => {
                    this.setState({
                      toYear: text,
                      error: {
                        ...this.state.error,
                        toYear: {error: false, message: ''},
                      },
                    });
                    this.navBar._hide();
                  }}
                />
              </View>
              <TextField
                placeholder={'Major'}
                value={this.state.major}
                showError={this.state.error.major.error}
                errorMessage={this.state.error.major.message}
                returnKeyType="next"
                onChange={(text: string) => {
                  this.setState({
                    major: text,
                    error: {
                      ...this.state.error,
                      major: {error: false, message: ''},
                    },
                  });
                  this.navBar._hide();
                }}
              />
              <TextField
                placeholder={'Minor'}
                value={this.state.minor}
                showError={this.state.error.minor.error}
                errorMessage={this.state.error.minor.message}
                returnKeyType="done"
                onChange={(text: string) => {
                  this.setState({
                    minor: text,
                    error: {
                      ...this.state.error,
                      minor: {error: false, message: ''},
                    },
                  });
                  this.navBar._hide();
                }}
              />
              <TextField
                placeholder={'Degree'}
                value={this.state.minor}
                showError={this.state.error.minor.error}
                errorMessage={this.state.error.minor.message}
                returnKeyType="done"
                onChange={(text: string) => {
                  this.setState({
                    minor: text,
                    error: {
                      ...this.state.error,
                      minor: {error: false, message: ''},
                    },
                  });
                  this.navBar._hide();
                }}
              />
              <SubmitButton
                style={{marginTop: 32}}
                text="Send Request to Join"
                onPress={() => {}}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: {[x: string]: any}) => ({});

const mapDispatchToProps = (dispatch: Function) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RegFinalStep);

const styles = EStyleSheet.create({
  $size: Size.byWidth(43),
  container: {
    padding: Size.byWidth(10),
    borderWidth: 1,
    borderColor: '#EAE7DF',
    flexDirection: 'row',
    backgroundColor: '#F4F1EA',
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
  },

  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: Size.byWidth(13),
  },

  name: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(16)),
    color: 'black',
    textAlign: 'left',
  },

  url: {
    fontStyle: 'normal',
    ...fontSize(Size.byWidth(14)),
    marginTop: Size.byWidth(5),
    color: '#595959',
    textAlign: 'left',
  },
  imageContainer: {
    width: '$size',
    height: '$size',
    backgroundColor: Colors.NewLightThemeColor,
    justifyContent: 'center',
  },

  image: {
    width: '$size - 16',
    height: '$size - 16',
    alignSelf: 'center',
  },
});
