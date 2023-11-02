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

resource "azurerm_virtual_network" "vnet" {
  name                = local.vnet_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.0.0.0/16"]
  dns_servers         = ["10.0.0.4", "10.0.0.5"]

  subnet {
    name           = "default" #acgsubnet
    address_prefix = "10.0.1.0/24"
  }

  lifecycle {
    ignore_changes = [
      subnet
    ]
  }
}

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
