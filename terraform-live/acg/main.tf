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
}

resource "azurerm_subnet" "subnet" {
  name                 = local.snet_name
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
  delegation {
    name = "delegation"
    service_delegation {
      name    = "Microsoft.ContainerInstance/containerGroups"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action", "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action"]
    }
  }
}

resource "azurerm_network_security_group" "nsg" {
  name                = local.network_security_group_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name              = "to-internet"
    priority          = 700
    direction         = "Outbound"
    access            = "Allow"
    protocol          = "Tcp"
    source_port_range = "*"

    destination_port_ranges    = [80, 443, 445]
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "DenyAllOutBound-Override"
    priority                   = 1000
    direction                  = "Outbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "DenyAllInBound-Override"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "subnet_network_security_group_association" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_network_profile" "container_group_profile" {
  name                = "acg-profile"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  container_network_interface {
    name = "acg-nic"

    ip_configuration {
      name      = "aciipconfig"
      subnet_id = azurerm_subnet.subnet.id
    }
  }
}

resource "azurerm_container_group" "mongodb" {
  name                = "mongodb-container"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location # Choose your desired Azure region
  os_type             = "Linux"
  ip_address_type     = "Private"
  network_profile_id  = azurerm_network_profile.container_group_profile.id

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

  tags = {
    environment = var.environment
  }

}

resource "azurerm_container_group" "backend" {
  name                = "backend-container"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location # Choose your desired Azure region
  os_type             = "Linux"

  image_registry_credential {
    username = data.azurerm_container_registry.acr.admin_username
    password = data.azurerm_container_registry.acr.admin_password
    server   = data.azurerm_container_registry.acr.login_server
  }

  container {
    name   = "backend"
    image  = "${data.azurerm_container_registry.acr.login_server}/backend:latest"
    cpu    = "1.0"
    memory = "2.0"

    environment_variables = {
      MONGODB_HOST                 = azurerm_container_group.mongodb.ip_address
      MONGO_INITDB_DATABASE        = "mydb"
      MONGO_INITDB_ROOT_USERNAME   = "root"
      MONGO_INITDB_ROOT_PASSWORD   = "example"
      NODE_ENV                     = "development"
      JWT_TOKEN                    = "ABC123456"
      JWT_TOKEN_EXPIRATION_SECONDS = "144000s"
      APP_PORT                     = 80
    }

    commands = ["npm", "run", "start:prod"]

    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  tags = {
    environment = var.environment
  }

}

resource "azurerm_network_security_rule" "backend_to_mongodb" {
  depends_on                  = [azurerm_container_group.backend, azurerm_container_group.mongodb]
  name                        = "rule-backend-to-mongodb"
  resource_group_name         = azurerm_resource_group.rg.name
  network_security_group_name = azurerm_network_security_group.nsg.name
  protocol                    = "Tcp"
  priority                    = 900
  direction                   = "Inbound"
  access                      = "Allow"
  source_port_range           = "*"
  destination_port_range      = 27017
  source_address_prefix       = azurerm_container_group.backend.ip_address
  destination_address_prefix  = azurerm_container_group.mongodb.ip_address
}

# resource "azurerm_network_security_rule" "frontend_to_backend_inbound" {
#   depends_on                  = [azurerm_container_group.backend]
#   name                        = "rule-frontend-to-backend"
#   resource_group_name         = azurerm_resource_group.rg.name
#   network_security_group_name = azurerm_network_security_group.nsg.name
#   protocol                    = "Tcp"
#   priority                    = 800
#   direction                   = "Inbound"
#   access                      = "Allow"
#   source_address_prefix       = "*" #add later the container group from frontend
#   source_port_ranges          = [80, 443, 445]
#   destination_port_range      = 3000
#   destination_address_prefix  = azurerm_container_group.backend.ip_address
# }

# resource "azurerm_network_security_rule" "internet_to_frontend_inbound" {
#   depends_on                  = [azurerm_container_group.backend]
#   name                        = "rule-internet-to-frontend"
#   resource_group_name         = azurerm_resource_group.rg.name
#   network_security_group_name = azurerm_network_security_group.nsg.name
#   protocol                    = "Tcp"
#   priority                    = 700
#   direction                   = "Inbound"
#   access                      = "Allow"
#   destination_port_ranges      = [80, 443, 445]
#   source_address_prefix       = "*"
#   destination_address_prefix  = azurerm_container_group.backend.ip_address #add later the container group from frontend
# }
