# Define a function to standardize Azure region names
#https://github.com/claranet/terraform-azurerm-regions/blob/master/REGIONS.md
locals {
  region_name_standardize = {
    "East US"          = "eus",
    "West US"          = "wus",
    "North Central US" = "ncus",
    "South Central US" = "scus",
    "East US 2"        = "eastus2",
    "West US 2"        = "westus2",
    "Central US"       = "cus",
    "West Central US"  = "wcus",
    "Canada East"      = "canadaeast",
    "Canada Central"   = "canadacentral",
    "West Europe"      = "euw",
    "westeurope"       = "euw",
    "eastus"           = "eus",
    "east us"          = "eus"
    # Add more mappings as needed
  }
}

locals {
  resource_group_name = "rg-${local.region_name_standardize[var.location]}-${app_name}-${var.environment}"
  pip_name            = "pip-${local.region_name_standardize[var.location]}-${app_name}-${var.environment}"
  vnet_name           = "vnet-${local.region_name_standardize[var.location]}-${app_name}-${var.environment}"
  nsg_name            = "nsg-${local.region_name_standardize[var.location]}-${app_name}-${var.environment}"
}
