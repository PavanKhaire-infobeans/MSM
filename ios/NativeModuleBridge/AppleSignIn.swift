//
//  AppleSignIn.swift
//  CueBack
//
//  Created by Pratik.Sinha on 04/05/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
import Foundation
import AuthenticationServices

@objc(AppleSignIn)
class AppleSignIn: UIViewController {
  @objc
  func SSOLogin() -> Void {
      if #available(iOS 13.0, *) {
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
            
        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.presentationContextProvider = self
        authorizationController.performRequests()
      } else {
        // Fallback on earlier versions
      }
    }
  }

  extension AppleSignIn: ASAuthorizationControllerDelegate {
    @available(iOS 13.0, *)
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
           
      if #available(iOS 13.0, *) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else {
          return
        }
        let id = appleIDCredential.user
        let familyName = appleIDCredential.fullName?.familyName ?? ""
        let givenName =  appleIDCredential.fullName?.givenName ?? ""
        let email = appleIDCredential.email ?? ""
        EventHandling.emitShowDetailEvent(withName: "ShowMemoryDetails", andPayload: ["id": id, "email": email,"familyName": familyName, "givenName": givenName , "error" : false])
      } else {
        // Fallback on earlier versions
      }
    }
    @available(iOS 13.0, *)
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
      EventHandling.emitShowDetailEvent(withName: "ShowMemoryDetails", andPayload: ["errorMsg": "AppleID Credential failed with error: \(error.localizedDescription)", "error" : true])
      }
  }

  extension AppleSignIn: ASAuthorizationControllerPresentationContextProviding {
    @available(iOS 13.0, *)
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
          return self.view.window!
      }
  }
