data "azurerm_log_analytics_workspace" "law" {
  name                = "central-law-prod"
  resource_group_name = "central-law-prod-rg"
}
