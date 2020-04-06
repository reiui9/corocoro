package com.corocoro;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import com.google.firebase.firestore.FirebaseFirestore;

import static com.corocoro.CurCovidStatusWidgetConfig.KEY_COUNTRY_TEXT;
import static com.corocoro.CurCovidStatusWidgetConfig.SHARED_PRES;

/**
 * Implementation of App Widget functionality.
 */
public class CurCovidStatusWidget extends AppWidgetProvider {

    private FirebaseFirestore db;

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {

        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);

        SharedPreferences prefs = context.getSharedPreferences(SHARED_PRES, Context.MODE_PRIVATE);
        String country = prefs.getString(KEY_COUNTRY_TEXT + appWidgetId, "Press me");
        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.cur_covid_status_widget);
        views.setOnClickPendingIntent(R.id.appwidget_root, pendingIntent);
        intent = new Intent(context, CurCovidStatusWidgetConfig.class);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        pendingIntent = PendingIntent.getActivity(context, 1, intent, 0);
        views.setOnClickPendingIntent(R.id.appwidget_configure, pendingIntent);
        views.setTextViewText(R.id.appwidget_country, country);


        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
        db = FirebaseFirestore.getInstance();
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

