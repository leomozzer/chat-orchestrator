data "azurerm_log_analytics_workspace" "law" {
  name                = "central-law-prod"
  resource_group_name = "central-law-prod-rg"
}

data "azurerm_container_registry" "acr" {
  name                = var.data_acr_name
  resource_group_name = var.data_acr_rg
}
