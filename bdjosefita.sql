                                          --          \i c:/datos/bdproyecto.sql


SELECT 'Paso 0 Bloque Crear BDJOSEFITA .....' as paso  ;;
SELECT '.........................................' as paso  ;

-------------------------------------------------------------------------


\c postgres
SELECT 'Paso 1 Iniciando el Script .....' as paso  ;


SELECT 'Paso 2 Listado de las BD Josefita .....' as paso;
\l


--  'Eliminando la base de datos si existe'
SELECT 'Paso 3 Eliminar  BD Josefita si Existe .....' as paso  ;
DROP DATABASE IF EXISTS bdproyecto;

\l

SELECT 'Paso 4 Crear BD Josefita .....' as paso  ;
CREATE DATABASE  bdjosefita with ENCODING='UTF8';


--------------------------------------------------------------------
--'Conectandonos a BD Josefita'


SELECT 'Paso 5 Conectandose a bdjosefita .....' as paso  ;
\c bdjosefita




-------------------------------------------------------------------------
-- '02.- BLOQUE DE CREACIÓN DE TABLAS'
SELECT ' Bloque Crear TABLAS .....' as paso ;
SELECT '.........................................' as paso  ;


-- 'TMSTATUS'-------------------------------
SELECT ' TMSTATUS .....................' as paso ;
CREATE  TABLE  tmstatus(
	pkcod_s	 INTEGER not   null   primary key,
	dstatus varchar(12)    not null);

INSERT    INTO   tmstatus  (pkcod_s, dstatus)  VALUES  (0,  'ELIMINADO'); 
INSERT    INTO   tmstatus  (pkcod_s, dstatus)  VALUES  (1,  'ACTIVO'); 

SELECT  *   FROM  tmstatus ; 

-- 'TMSEXO'---------------

SELECT 'TMSEXO ........................' as paso;
CREATE TABLE tmsexo (
    pkcod_sx varchar(1) not null primary key ,
    dsexo varchar(15) not null);

INSERT INTO tmsexo (pkcod_sx, dsexo) VALUES   ('F',  'FEMENINO');
INSERT INTO tmsexo (pkcod_sx, dsexo) VALUES   ('M',  'MASCULINO');
INSERT INTO tmsexo (pkcod_sx, dsexo) VALUES   ('O',  'OTRO');

SELECT  *   FROM  tmsexo ;

--'TMPRENDAS'--------------

SELECT 'TMPRENDAS.............' AS Paso;
CREATE TABLE tmprendas (
    pkcod_p INTEGER not null primary key,
    Nom_P varchar(20) not null,
    talla varchar(5) not null,
    color varchar(20) not null,
    precio decimal(12,2) not null,
    fkcod_s_p INTEGER not null,


    foreign key (fkcod_s_p) references tmstatus(pkcod_s) on update cascade on delete restrict);


INSERT INTO tmprendas (pkcod_p, Nom_P, talla, color, precio, fkcod_s_p) VALUES   (1,  'Camisa Futbol', 'M','Rojo', 25000,1);


SELECT * from tmprendas;


--'TMCLIENTES'--------------

SELECT 'TMCLIENTES.............' AS Paso;
CREATE TABLE tmclientes (
    pkcc_c bigint not null primary key,
    Nom_c varchar(30) not null,
    dir_c varchar(30) not null,
    cel_c bigint not null,
    fkcod_sx varchar(1) not null,
    fkcod_s_c INTEGER not null,

foreign key (fkcod_sx) references tmsexo(pkcod_sx) on update cascade on delete restrict, 
foreign key (fkcod_s_c) references tmstatus(pkcod_s) on update cascade on delete restrict);


INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878393,  'Jaider Solano', 'Calle 14 Motilones',3132569874,'M',1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878301, 'Carlos Becerra', 'Cra 7 #12-45 Centro', 3104589632, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878302, 'Maria Lopez', 'Calle 9 #8-22 San Jose', 3157894561, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878303, 'Julian Torres', 'Av 20 #5-30 Las Palmas', 3112564789, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878304, 'Paola Rincon', 'Calle 3 Norte #11-18 Chapinero', 3205489631, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878305, 'Andres Silva', 'Cra 15 #20-55 Santa Ana', 3017896543, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878306, 'Luisa Martinez', 'Barrio El Prado Mz A Casa 12', 3164578920, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878307, 'Samuel Gomez', 'Calle 40 #27-14 Altamira', 3126548790, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878308, 'Valentina Herrera', 'Cra 50 #32-20 Los Alamos', 3194567802, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878309, 'David Castano', 'Calle 18 Sur #3-60 San Luis', 3148907654, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878310, 'Sara Benavides', 'Barrio Villa Nueva #45-12', 3175698042, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878311, 'Esteban Pineda', 'Cra 8 #14-26 La Campina', 3007894562, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878312, 'Karen Cruz', 'Calle 2 #7-88 San Martin', 3123456709, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878313, 'Felipe Duarte', 'Av Libertador #12-10', 3187650943, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878314, 'Daniela Arevalo', 'Urbanizacion Los Cedros Torre 1 Apto 302', 3135907461, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878315, 'Miguel Quintero', 'Calle 33 #19-50 Belen', 3218794506, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878316, 'Natalia Gomez', 'Calle 12 #6-40 San Pedro', 3106798541, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878317, 'Jhonatan Ruiz', 'Cra 21 #10-33 Buenos Aires', 3134509872, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878318, 'Lina Castillo', 'Barrio El Carmen Mz B Casa 18', 3157890123, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878319, 'Ricardo Mendoza', 'Calle 52 #25-70 La Floresta', 3129046753, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878320, 'Juliana Reyes', 'Cra 4 #3-99 Santa Lucia', 3198456071, 'F', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878321, 'Oscar Rivera', 'Calle 27 #15-11 El Eden', 3115679840, 'M', 1);
INSERT INTO tmclientes (pkcc_c, Nom_c, dir_c, cel_c, fkcod_sx, fkcod_s_c) VALUES (1004878322, 'Marcela Jimenez', 'Av 1 #44-20 Los Nogales', 3004789651, 'F', 1);

SELECT * from tmclientes;
--'TMFACTURAS'--------------

SELECT 'TMFACTURAS.............' AS Paso;
CREATE TABLE tmfacturas (
    pkcod_f INTEGER not null primary key,
    fkcc_c bigint not null,
    fkcod_p INTEGER not null,
    cantidad INTEGER not null,
    Monto_total decimal(12,2) not null,
    fecha date not null,
    hora time not null,
    fkcod_s_f INTEGER not null,


    foreign key (fkcc_c) references tmclientes(pkcc_c) on update cascade on delete restrict,
    foreign key (fkcod_p) references tmprendas(pkcod_p) on update cascade on delete restrict,
    foreign key (fkcod_s_f) references tmstatus(pkcod_s) on update cascade on delete restrict);


INSERT INTO tmfacturas (pkcod_f, fkcc_c, fkcod_p, cantidad, Monto_total, fecha, hora, fkcod_s_f) VALUES   (1, 1004878393, 1, 1, 25000,'2025-01-12','02:15:00',1);

SELECT * from tmfacturas;


--'TMABONOS'--------------

SELECT 'TMFABONOS.............' AS Paso;
CREATE TABLE tmabonos (
    pkcod_abono INTEGER not null primary key,
    fkcod_f bigint not null,
    fkcc_c bigint not null,
    dmetodo_pago varchar(20) not null,
    Monto_a decimal(12,2) not null,
    fecha date not null,
    hora time not null,
    fkcod_s_a INTEGER not null,


    foreign key (fkcod_f) references tmfacturas(pkcod_f) on update cascade on delete restrict,
    foreign key (fkcc_c) references tmclientes(pkcc_c) on update cascade on delete restrict,
    foreign key (fkcod_s_a) references tmstatus(pkcod_s) on update cascade on delete restrict);


INSERT INTO tmabonos (pkcod_abono, fkcod_f, fkcc_c, dmetodo_pago, Monto_a, fecha, hora, fkcod_s_a) VALUES   (1, 1, 1004878393, 'transferencia', 25000,'2025-01-12','02:15:00',1);

SELECT * from tmabonos;

