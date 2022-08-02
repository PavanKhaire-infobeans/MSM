import React, { Component } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import Text from '../../common/component/Text';
import { Account } from '../../common/loginStore';
//@ts-ignore
import EStyleSheet from 'react-native-extended-stylesheet';
import { SubmitButton } from '../../common/component/button';
import NavigationHeaderSafeArea from '../../common/component/profileEditHeader/navigationHeaderSafeArea';
import TextField from '../../common/component/textField';
import { Colors, fontSize, Size } from '../../common/constants';
import Utility from '../../common/utility';
import Styles from './styles';

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

  componentDidMount =()=>{
    Keyboard.dismiss()
  }

  render() {
    let accData = Account.tempData();
    return (
      <SafeAreaView
        style={Styles.safeAreaViewContainer}>
        <View style={Styles.regFirstStepContainer}>
          <NavigationHeaderSafeArea
            isRegisteration={true}
            ref={ref => (this.navBar = ref)}
          />
          <StatusBar
            barStyle={ Utility.currentTheme == 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={Colors.NewThemeColor}
          />
          <ScrollView
            // keyboardShouldPersistTaps="always"
            // keyboardDismissMode="s"
            style={Styles.ScrollViewStyle}
            onScroll={()=>{Keyboard.dismiss()}}
            contentContainerStyle={{alignItems: 'center'}}
            bounces={false}>
            <View style={Styles.ScrollViewStyleContainer}>
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
                style={Styles.weneedText}>
                We need some additional information to provide you a better
                experience.
              </Text>
              <Text
                style={Styles.Yearstext}>{`Years you were at ${Account.tempData().name}`}</Text>
              <View
                style={Styles.textInputContainer}>
                <TextField
                  style={Styles.fromYearTextInput}
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
                  style={Styles.toYearTextInput}
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
                style={Styles.joinButton}
                text="Send Request to Join"
                onPress={() => {}}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: {[x: string]: any}) => ({});

const mapDispatchToProps = (dispatch: Function) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RegFinalStep);
