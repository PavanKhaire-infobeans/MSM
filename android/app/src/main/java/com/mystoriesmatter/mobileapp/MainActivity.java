package com.cueback;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MyStoriesMatter";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(null);
    // ATTENTION: This was auto-generated to handle app links.
    Intent appLinkIntent = getIntent();
    String appLinkAction = appLinkIntent.getAction();
    Uri appLinkData = appLinkIntent.getData();
    Log.d("an_id", String.valueOf(appLinkData));
  }
}
