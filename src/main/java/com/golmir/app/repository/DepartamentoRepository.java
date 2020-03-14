package com.golmir.app.repository;

import com.golmir.app.domain.Departamento;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Departamento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
}
