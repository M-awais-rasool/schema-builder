package utils

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var Validator *validator.Validate

func InitValidator() {
	Validator = validator.New()

	// Register custom validators if needed
	// Validator.RegisterValidation("custom_tag", customValidatorFunc)
}

func GetValidator() *validator.Validate {
	if Validator == nil {
		InitValidator()
	}
	return Validator
}

func ValidateStruct(s interface{}) map[string]string {
	validatorInstance := GetValidator()
	err := validatorInstance.Struct(s)

	if err != nil {
		errors := make(map[string]string)

		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, validationErr := range validationErrors {
				field := strings.ToLower(validationErr.Field())
				tag := validationErr.Tag()

				switch tag {
				case "required":
					errors[field] = fmt.Sprintf("%s is required", field)
				case "email":
					errors[field] = "Invalid email format"
				case "min":
					errors[field] = fmt.Sprintf("%s must be at least %s characters", field, validationErr.Param())
				case "max":
					errors[field] = fmt.Sprintf("%s must be at most %s characters", field, validationErr.Param())
				case "url":
					errors[field] = "Invalid URL format"
				default:
					errors[field] = fmt.Sprintf("%s is invalid", field)
				}
			}
		}

		return errors
	}

	return nil
}
