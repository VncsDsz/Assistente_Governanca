package com.vncs.assistente_governanca.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "dados_clientes")
public class DadosCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @Column(nullable = false, length = 150)
    private String nomeEmpresa;

    @Column(length = 100)
    private String setorAtuacao;

    private Integer scoreCredito;

    @Column(nullable = false)
    private LocalDate dataCadastro;
}