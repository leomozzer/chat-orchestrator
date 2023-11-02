resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = var.location
  tags     = var.tags
}

# resource "azurerm_public_ip" "public_ip" {
#   name                = local.pip_name
#   resource_group_name = azurerm_resource_group.rg.name
#   location            = var.location
#   allocation_method   = var.allocation_method
#   sku                 = var.sku
# }

resource "azurerm_container_group" "mongodb" {
  name                = "mongodb-container"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location # Choose your desired Azure region
  os_type             = "Linux"

  container {
    name   = "mongodb"
    image  = "mongo:latest"
    cpu    = "0.5"
    memory = "1.5"

    environment_variables = {
      MONGO_INITDB_ROOT_USERNAME = "root"
      MONGO_INITDB_ROOT_PASSWORD = "example"
      MONGO_INITDB_DATABASE      = "mydb"
    }

    ports {
      port     = 27017
      protocol = "TCP"
    }
  }

  diagnostics {
    log_analytics {
      workspace_id  = data.azurerm_log_analytics_workspace.law.id
      workspace_key = data.azurerm_log_analytics_workspace.law.primary_shared_key
    }
  }
  tags = {
    environment = "development"
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = local.vnet_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.0.0/16"]
  dns_servers         = ["10.0.0.4", "10.0.0.5"]
}

resource "azurerm_subnet" "subnet" {
  name                 = local.snet_name
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# resource "azurerm_private_endpoint" "mongo" {
#   name                = local.private_endpoint_mongo
#   location            = var.location
#   resource_group_name = azurerm_resource_group.rg.name
#   subnet_id           = azurerm_subnet.subnet.id

#   private_service_connection {
#     name                           = "mongo-connection"
#     private_connection_resource_id = azurerm_container_group.mongodb.id
#     is_manual_connection           = false
#   }
# }

# resource "azurerm_network_security_rule" "network_security_rule" {
#   name                         = var.name
#   resource_group_name          = var.resource_group_name
#   network_security_group_name  = var.network_security_group_name
#   priority                     = var.priority
#   direction                    = var.direction
#   access                       = var.access
#   protocol                     = var.protocol
#   source_port_range            = var.source_port_range
#   destination_port_ranges      = var.destination_port_ranges
#   source_address_prefixes      = var.source_address_prefixes
#   destination_address_prefixes = var.destination_address_prefixes
# }
