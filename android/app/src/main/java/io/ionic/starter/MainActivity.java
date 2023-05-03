package io.ionic.starter;
import com.facebook.LoggingBehavior;
import com.getcapacitor.BridgeActivity;

import android.app.Activity;
import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(
      com.getcapacitor.community.facebooklogin.FacebookLogin.class
    );
//    AppEventsLogger.activateApp(this);
    debugHashKey();
  }

  private void debugHashKey() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    "io.ionic.starter",
                    PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
                String hashKey = Base64.encodeToString(md.digest(), Base64.DEFAULT);
//                 FacebookSdk.setAppli ("io.ionic.starter", hashKey);
 //            FacebookSdk.addApp
//                  FacebookSdk.setClientToken("760d57b67217b7b2d264a179ad24e57b");
//                  FacebookSdk.setApplicationId("541569761353240");
//                  FacebookSdk.setFacebookDomain("facebook.com");
//                  FacebookSdk.setGraphApiVersion("v11.0");
//                  FacebookSdk.setAutoLogAppEventsEnabled(true);
//                  FacebookSdk.setIsDebugEnabled(true);
//                  FacebookSdk.setLegacyTokenUpgradeEnabled(false);
//                  FacebookSdk.setAdvertiserIDCollectionEnabled(true);
//                  FacebookSdk.addLoggingBehavior(LoggingBehavior.APP_EVENTS);
//                  FacebookSdk.addLoggingBehavior(LoggingBehavior.DEVELOPER_ERRORS);
//                  AppEventsLogger logger = AppEventsLogger.newLogger(this);
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }
    }



}
