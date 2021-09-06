//
//  EventHandling.m
//  CueBack
//
//  Created by Anubhav.Saxena on 21/02/19.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "EventHandling.h"
@implementation EventHandling
  RCT_EXPORT_MODULE();


+ (id)sharedManager {
  static EventHandling *sharedEventHandling = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedEventHandling = [super allocWithZone:nil];
  });
  return sharedEventHandling;
}

- (void)startObserving
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(emitErrorEventInternal:)
                                               name:@"event-emitted"
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(showDetailEventInternal:)
                                               name:@"show-details"
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(showPdfDetailEventInternal:)
                                               name:@"show-pdf"
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playAudioEventInternal:) name:@"open-audio" object: nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openImageEventInternal:) name:@"open-image" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(closeAudioEventInternal:) name:@"close-audio" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(addPromptToMemoryEventInternal:) name:@"add_memory" object:nil];
   [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appleSigninEventInternal:) name:@"apple_login" object:nil];
}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)emitErrorEventInternal:(NSNotification *)notification
{
  NSDictionary* userInfo = notification.userInfo;
  NSString *errorType = (NSString*)userInfo[@"ErrorType"];
  NSString *errorMessage = (NSString*)userInfo[@"ErrorMessage"];
  if([errorType isEqualToString:@"NoInternet"]){
    [self sendEventWithName:@"NoInternet"
                       body:errorMessage];
  }else if([errorType isEqualToString:@"LogoutUser"]){
    [self sendEventWithName:@"LogoutUser"
                       body:errorMessage];
  }else{
    [self sendEventWithName:@"ErrorRecieved"
                       body:errorMessage];
  }
}

- (void)showDetailEventInternal:(NSNotification *)notification
{
  NSDictionary* userInfo = notification.userInfo;
  [self sendEventWithName:@"ShowMemoryDetails"
                     body:userInfo];
}

- (void)showPdfDetailEventInternal:(NSNotification *)notification
{
  NSDictionary* userInfo = notification.userInfo;
  [self sendEventWithName:@"OpenPdf"
                     body:userInfo];
}
-(void) playAudioEventInternal:(NSNotification *) notification{
  NSDictionary* userInfo = notification.userInfo;
  [self sendEventWithName:@"OpenAudios"
                     body:userInfo];

}
-(void) openImageEventInternal: (NSNotification *) notification{
  NSDictionary* userInfo = notification.userInfo;
  [self sendEventWithName:@"OpenImages" body:userInfo];
}
-(void) closeAudioEventInternal: (NSNotification *) notification{
  NSDictionary* userInfo = notification.userInfo;
  [self sendEventWithName:@"CloseAudio" body:userInfo];
}
-(void) addPromptToMemoryEventInternal: (NSNotification *)notification{
  NSDictionary* info = notification.userInfo;
  [self sendEventWithName:@"AddToMemory" body:info];
}
-(void) appleSigninEventInternal: (NSNotification *) notification{
  NSDictionary* info = notification.userInfo;
  [self sendEventWithName:@"AppleLoginResult" body:info];
}

+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"event-emitted"
                                                      object:self
                                                    userInfo:payload];
}
+ (void) emitAppleLoginEventWithName: (NSString * ) name andPayload: (NSDictionary *)payload
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"apple_login"
    object:self
                                                    userInfo:payload];
}
+ (void)emitShowDetailEventWithName:(NSString *)name andPayload:(NSDictionary *)payload
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"show-details"
                                                      object:self
                                                    userInfo:payload];
}
+ (void) emitShowPdfEventWithName:(NSString *) name andPayload: (NSDictionary *) payload{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"show-pdf"
                                                      object:self
                                                    userInfo:payload];
}
+ (void) emitOpenAudioEventWithName:(NSString *) name andPayload: (NSDictionary *) payload{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"open-audio"
                                                      object:self
                                                    userInfo:payload];
}
+ (void) emitOpenImageEventWithName: (NSString *) name andPayload: (NSDictionary*) payload{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"open-image"
                                                      object:self
                                                    userInfo:payload];
}
+ (void) emitCloseAudioEventWithName: (NSString *) name andPayload: (NSDictionary*) payload{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"close-audio" object:self userInfo:payload];
}
- (NSArray<NSString *> *)supportedEvents {
  return @[@"ErrorRecieved", @"NoInternet", @"LogoutUser", @"ShowMemoryDetails", @"OpenPdf", @"OpenAudios", @"OpenImages", @"CloseAudio", @"AddToMemory", @"AppleLoginResult"];
  }
+ (BOOL)requiresMainQueueSetup{
  return YES;
}
@end
