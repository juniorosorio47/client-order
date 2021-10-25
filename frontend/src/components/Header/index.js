import React from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const Header = ({name, addButtonText, handleAdd, children}) => {
    return (
        <Container className="" style={{ width: 'auto', height: '100px' }}>
            <Row>
                <Col >
                    <h1>{name}</h1>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button type="button" variant="primary" onClick={handleAdd}>{addButtonText}</Button>
                </Col>
            </Row>
            
            
        </Container>
    )
}
