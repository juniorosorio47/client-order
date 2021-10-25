import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';

export const GlobalNavbar = () => {
  return (
    <div>
      <Navbar className="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <Container>
          <Navbar.Brand href="/">Star Atacado</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/products">Produtos</Nav.Link>
              <Nav.Link href="/clients">Clientes</Nav.Link>
              <Nav.Link href="/orders">Venda</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
