package com.golmir.app.service;

import com.golmir.app.domain.Empleado;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Empleado}.
 */
public interface EmpleadoService {

    /**
     * Save a empleado.
     *
     * @param empleado the entity to save.
     * @return the persisted entity.
     */
    Empleado save(Empleado empleado);

    /**
     * Get all the empleados.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Empleado> findAll(Pageable pageable);

    /**
     * Get the "id" empleado.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Empleado> findOne(Long id);

    /**
     * Delete the "id" empleado.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
