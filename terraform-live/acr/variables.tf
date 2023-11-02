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

variable "acr_sku" {
  type    = string
  default = "Basic"
}
