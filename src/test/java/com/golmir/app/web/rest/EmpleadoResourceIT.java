package com.golmir.app.web.rest;

import com.golmir.app.GolmirjhApp;
import com.golmir.app.domain.Empleado;
import com.golmir.app.repository.EmpleadoRepository;
import com.golmir.app.service.EmpleadoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EmpleadoResource} REST controller.
 */
@SpringBootTest(classes = GolmirjhApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class EmpleadoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDO = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDO = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_TELEFONO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_TELEFONO = "BBBBBBBBBB";

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final Instant DEFAULT_FECHA_CONTRATACION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_CONTRATACION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EmpleadoService empleadoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmpleadoMockMvc;

    private Empleado empleado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Empleado createEntity(EntityManager em) {
        Empleado empleado = new Empleado()
            .nombre(DEFAULT_NOMBRE)
            .apellido(DEFAULT_APELLIDO)
            .email(DEFAULT_EMAIL)
            .numeroTelefono(DEFAULT_NUMERO_TELEFONO)
            .titulo(DEFAULT_TITULO)
            .fechaContratacion(DEFAULT_FECHA_CONTRATACION);
        return empleado;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Empleado createUpdatedEntity(EntityManager em) {
        Empleado empleado = new Empleado()
            .nombre(UPDATED_NOMBRE)
            .apellido(UPDATED_APELLIDO)
            .email(UPDATED_EMAIL)
            .numeroTelefono(UPDATED_NUMERO_TELEFONO)
            .titulo(UPDATED_TITULO)
            .fechaContratacion(UPDATED_FECHA_CONTRATACION);
        return empleado;
    }

    @BeforeEach
    public void initTest() {
        empleado = createEntity(em);
    }

    @Test
    @Transactional
    public void createEmpleado() throws Exception {
        int databaseSizeBeforeCreate = empleadoRepository.findAll().size();

        // Create the Empleado
        restEmpleadoMockMvc.perform(post("/api/empleados")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(empleado)))
            .andExpect(status().isCreated());

        // Validate the Empleado in the database
        List<Empleado> empleadoList = empleadoRepository.findAll();
        assertThat(empleadoList).hasSize(databaseSizeBeforeCreate + 1);
        Empleado testEmpleado = empleadoList.get(empleadoList.size() - 1);
        assertThat(testEmpleado.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testEmpleado.getApellido()).isEqualTo(DEFAULT_APELLIDO);
        assertThat(testEmpleado.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmpleado.getNumeroTelefono()).isEqualTo(DEFAULT_NUMERO_TELEFONO);
        assertThat(testEmpleado.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testEmpleado.getFechaContratacion()).isEqualTo(DEFAULT_FECHA_CONTRATACION);
    }

    @Test
    @Transactional
    public void createEmpleadoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = empleadoRepository.findAll().size();

        // Create the Empleado with an existing ID
        empleado.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmpleadoMockMvc.perform(post("/api/empleados")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(empleado)))
            .andExpect(status().isBadRequest());

        // Validate the Empleado in the database
        List<Empleado> empleadoList = empleadoRepository.findAll();
        assertThat(empleadoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllEmpleados() throws Exception {
        // Initialize the database
        empleadoRepository.saveAndFlush(empleado);

        // Get all the empleadoList
        restEmpleadoMockMvc.perform(get("/api/empleados?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(empleado.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellido").value(hasItem(DEFAULT_APELLIDO)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].numeroTelefono").value(hasItem(DEFAULT_NUMERO_TELEFONO)))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].fechaContratacion").value(hasItem(DEFAULT_FECHA_CONTRATACION.toString())));
    }
    
    @Test
    @Transactional
    public void getEmpleado() throws Exception {
        // Initialize the database
        empleadoRepository.saveAndFlush(empleado);

        // Get the empleado
        restEmpleadoMockMvc.perform(get("/api/empleados/{id}", empleado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(empleado.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellido").value(DEFAULT_APELLIDO))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.numeroTelefono").value(DEFAULT_NUMERO_TELEFONO))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO))
            .andExpect(jsonPath("$.fechaContratacion").value(DEFAULT_FECHA_CONTRATACION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEmpleado() throws Exception {
        // Get the empleado
        restEmpleadoMockMvc.perform(get("/api/empleados/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEmpleado() throws Exception {
        // Initialize the database
        empleadoService.save(empleado);

        int databaseSizeBeforeUpdate = empleadoRepository.findAll().size();

        // Update the empleado
        Empleado updatedEmpleado = empleadoRepository.findById(empleado.getId()).get();
        // Disconnect from session so that the updates on updatedEmpleado are not directly saved in db
        em.detach(updatedEmpleado);
        updatedEmpleado
            .nombre(UPDATED_NOMBRE)
            .apellido(UPDATED_APELLIDO)
            .email(UPDATED_EMAIL)
            .numeroTelefono(UPDATED_NUMERO_TELEFONO)
            .titulo(UPDATED_TITULO)
            .fechaContratacion(UPDATED_FECHA_CONTRATACION);

        restEmpleadoMockMvc.perform(put("/api/empleados")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEmpleado)))
            .andExpect(status().isOk());

        // Validate the Empleado in the database
        List<Empleado> empleadoList = empleadoRepository.findAll();
        assertThat(empleadoList).hasSize(databaseSizeBeforeUpdate);
        Empleado testEmpleado = empleadoList.get(empleadoList.size() - 1);
        assertThat(testEmpleado.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testEmpleado.getApellido()).isEqualTo(UPDATED_APELLIDO);
        assertThat(testEmpleado.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmpleado.getNumeroTelefono()).isEqualTo(UPDATED_NUMERO_TELEFONO);
        assertThat(testEmpleado.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testEmpleado.getFechaContratacion()).isEqualTo(UPDATED_FECHA_CONTRATACION);
    }

    @Test
    @Transactional
    public void updateNonExistingEmpleado() throws Exception {
        int databaseSizeBeforeUpdate = empleadoRepository.findAll().size();

        // Create the Empleado

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmpleadoMockMvc.perform(put("/api/empleados")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(empleado)))
            .andExpect(status().isBadRequest());

        // Validate the Empleado in the database
        List<Empleado> empleadoList = empleadoRepository.findAll();
        assertThat(empleadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEmpleado() throws Exception {
        // Initialize the database
        empleadoService.save(empleado);

        int databaseSizeBeforeDelete = empleadoRepository.findAll().size();

        // Delete the empleado
        restEmpleadoMockMvc.perform(delete("/api/empleados/{id}", empleado.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Empleado> empleadoList = empleadoRepository.findAll();
        assertThat(empleadoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
