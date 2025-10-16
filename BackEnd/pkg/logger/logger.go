package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Log *logrus.Logger

func Init(env string) {
	Log = logrus.New()

	Log.SetOutput(os.Stdout)

	if env == "production" {
		Log.SetLevel(logrus.InfoLevel)
		Log.SetFormatter(&logrus.JSONFormatter{})
	} else {
		Log.SetLevel(logrus.DebugLevel)
		Log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
			ForceColors:   true,
		})
	}
}

func GetLogger() *logrus.Logger {
	if Log == nil {
		Init("development")
	}
	return Log
}
