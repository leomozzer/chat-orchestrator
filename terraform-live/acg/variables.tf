variable "app_name" {
  type = string
}

variable "location" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "data_acr_name" {
  type = string
}

variable "data_acr_rg" {
  type = string
}
