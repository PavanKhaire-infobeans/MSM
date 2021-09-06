//
//  EventHandling.h
//  CueBack
//
//  Created by Anubhav.Saxena on 21/02/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>

NS_ASSUME_NONNULL_BEGIN

@interface EventHandling : RCTEventEmitter <RCTBridgeModule>
+ (id)sharedManager;
+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload;
+ (void)emitShowDetailEventWithName:(NSString *)name andPayload:(NSDictionary *)payload;
+ (void) emitShowPdfEventWithName:(NSString *) name andPayload: (NSDictionary *) payload;
+ (void) emitOpenAudioEventWithName:(NSString *) name andPayload: (NSDictionary *) payload;
+ (void) emitOpenImageEventWithName: (NSString *) name andPayload: (NSDictionary*) payload;
+ (void) emitCloseAudioEventWithName: (NSString *) name andPayload: (NSDictionary*) payload;
+ (void) emitAppleLoginEventWithName: (NSString * ) name andPayload: (NSDictionary *)payload;
@end

NS_ASSUME_NONNULL_END
