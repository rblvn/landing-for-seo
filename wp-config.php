<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define( 'DB_NAME', 'evacuator' );

/** Имя пользователя MySQL */
define( 'DB_USER', 'admin' );

/** Пароль к базе данных MySQL */
define( 'DB_PASSWORD', 'admin' );

/** Имя сервера MySQL */
define( 'DB_HOST', 'localhost' );

/** Кодировка базы данных для создания таблиц. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Схема сопоставления. Не меняйте, если не уверены. */
define( 'DB_COLLATE', '' );

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'EK|D }J,O@p#lFAawknie|9wd7%mlx=I)pCT(o+Vw/k)G-Ri[JO+bKNw:.~EbuO[' );
define( 'SECURE_AUTH_KEY',  '>+~tm4_j_ywS((f~.!r2k9vcwl?m?)Z9=vV4wcps!6q%}%<6rJlt&F]d]?I.>qa-' );
define( 'LOGGED_IN_KEY',    '4Yn3^ek?Uv:G_A|es7e h,Y, 6YN|aXL3y]2rSpz;jj(.dWC/Hq[IWv~&^_N!m0_' );
define( 'NONCE_KEY',        'ds5Tb;.7A:kECwOl+=B)<rJ]`K-i*z1+423U?{ixb5i5C[HO$Xhh<[ pccm(e:6i' );
define( 'AUTH_SALT',        'oE&[+t`94Zuh%h=Hu@YNbtd<$gCv@<zu6cC!7;M[4#+=_;AkfXED$^>c.X]X>-?H' );
define( 'SECURE_AUTH_SALT', '@Y-+.,DKXkP`F;T 7<5T3{vKdY3oCIs!P,x0M+^%8&T]p71<4eGYdDbzfwf$]^<<' );
define( 'LOGGED_IN_SALT',   'VWtcKo1&Q~e)/g?_OTEtZA>(t:XNEdmn(@mV/Wq4.JL*z$_@@+czX#X7F=2aK?:?' );
define( 'NONCE_SALT',       'JdK@S0p:/KFEs,RZ<Sfm~:BHa se|k54Q0(R4q^c(}@rGA//=It1?k?[J];@1wsH' );

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix = 'wp_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', true );

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Инициализирует переменные WordPress и подключает файлы. */
require_once( ABSPATH . 'wp-settings.php' );