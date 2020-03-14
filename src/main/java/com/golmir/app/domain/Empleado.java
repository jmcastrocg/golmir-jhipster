package com.golmir.app.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.Instant;

/**
 * A Empleado.
 */
@Entity
@Table(name = "empleado")
public class Empleado implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "email")
    private String email;

    @Column(name = "numero_telefono")
    private String numeroTelefono;

    @Column(name = "fecha_contratacion")
    private Instant fechaContratacion;

    @OneToOne
    @JoinColumn(unique = true)
    private Direccion direccion;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public Empleado nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public Empleado apellido(String apellido) {
        this.apellido = apellido;
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public Empleado email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumeroTelefono() {
        return numeroTelefono;
    }

    public Empleado numeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
        return this;
    }

    public void setNumeroTelefono(String numeroTelefono) {
        this.numeroTelefono = numeroTelefono;
    }

    public Instant getFechaContratacion() {
        return fechaContratacion;
    }

    public Empleado fechaContratacion(Instant fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
        return this;
    }

    public void setFechaContratacion(Instant fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }

    public Direccion getDireccion() {
        return direccion;
    }

    public Empleado direccion(Direccion direccion) {
        this.direccion = direccion;
        return this;
    }

    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Empleado)) {
            return false;
        }
        return id != null && id.equals(((Empleado) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Empleado{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", email='" + getEmail() + "'" +
            ", numeroTelefono='" + getNumeroTelefono() + "'" +
            ", fechaContratacion='" + getFechaContratacion() + "'" +
            "}";
    }
}
