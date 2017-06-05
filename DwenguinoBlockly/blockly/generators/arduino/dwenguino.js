/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.dwenguino');

goog.require('Blockly.Arduino');


// This is now integrated in the setup loop structure so children don't have to know about the initialisation step and can just start coding
Blockly.Arduino['initDwenguino'] = function (block) {

//    Blockly.Arduino.definitions_['define_wire_h'] = '#include <Wire.h>\n';
//    Blockly.Arduino.definitions_['define_dwenguino_h'] = '#include <Dwenguino.h>\n';
//    Blockly.Arduino.definitions_['define_lcd_h'] = '#include <LiquidCrystal.h>\n';

    //Blockly.Arduino.setups_['initDwenguino'] = 'initDwenguino();';
    //var code = 'initDwenguino();';
    return code;
};

Blockly.Arduino['setup_loop_structure'] = function (block) {
    Blockly.Arduino.definitions_['define_wire_h'] = '#include <Wire.h>\n';
    Blockly.Arduino.definitions_['define_dwenguino_h'] = '#include <Dwenguino.h>\n';
    Blockly.Arduino.definitions_['define_lcd_h'] = '#include <LiquidCrystal.h>\n';

    var statements_setup = Blockly.Arduino.statementToCode(block, 'SETUP');
    var statements_loop = Blockly.Arduino.statementToCode(block, 'LOOP');
    // Assemble Arduino into code variable.
    Blockly.Arduino.setups_['userSetupCode'] = 'initDwenguino();\n' + statements_setup + "\n";

    return statements_loop;


};


Blockly.Arduino['set_leds'] = function (block) {
    var value_register_value = Blockly.Arduino.valueToCode(block, 'register value', Blockly.Arduino.ORDER_ATOMIC);
    var code;
    if(!value_register_value.match(/^0b[01]{8}$/g)){
        alert("Register Value must be 8 bits after 0b as prefix");
        return code;
    }
    code = 'LEDS = ' + value_register_value + ';\n';
    return code;
};



Blockly.Arduino['dc_motor'] = function (block) {
    var value_channel = Blockly.Arduino.valueToCode(block, 'channel', Blockly.Arduino.ORDER_ATOMIC);
    var value_speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_ATOMIC);
    if( (value_speed < -255 ) || (value_speed > 255)) {
      alert("speed should be between -255 to 255")
      return code;
    }
    //import dwenguino motors
    Blockly.Arduino.definitions_['define_dwenguinomotor_h'] = "#include <DwenguinoMotor.h>\n";
    // declare motor on chosen channel
    Blockly.Arduino.definitions_['declare_dc_motor_on_channel_' + value_channel] = 'DCMotor dcMotor' + value_channel + '(MOTOR_' + value_channel + '_0, MOTOR_' + value_channel + '_1);\n';
    //start motor
    var code = 'dcMotor' + value_channel + '.setSpeed(' + value_speed + ');\n';
    return code;
};

Blockly.Arduino['dwenguino_lcd'] = function (block) {
    var value_text = Blockly.Arduino.valueToCode(block, 'text', Blockly.Arduino.ORDER_ATOMIC);
    var value_line_number = Blockly.Arduino.valueToCode(block, 'line_number', Blockly.Arduino.ORDER_ATOMIC);
    var value_character_number = Blockly.Arduino.valueToCode(block, 'character_number', Blockly.Arduino.ORDER_ATOMIC);
    // Assemble JavaScript into code variable.
    //import dwenguino lcd
    value_character_number -= 1;
    value_line_number -= 1;
    if( (value_character_number < 0 ) || (value_character_number > 15 )) {
      alert("character should be between 1 to 16")
      return code;
    }
    Blockly.Arduino.definitions_['define_lcd_h'] = "#include <LiquidCrystal.h>\n";
    var code = 'dwenguinoLCD.setCursor(' + value_character_number + ',' + value_line_number + ');\n';
    code = code + 'dwenguinoLCD.print(' + value_text + ');\n'
    return code;
};

Blockly.Arduino['clear_lcd'] = function (block) {
    //  Assemble JavaScript into code variable.
    var code = 'dwenguinoLCD.clear();\n';
    return code;
};

Blockly.Arduino['sonar_sensor'] = function (block) {
    var value_trig = Blockly.Arduino.valueToCode(block, 'trig', Blockly.Arduino.ORDER_NONE);
    var value_echo = Blockly.Arduino.valueToCode(block, 'echo', Blockly.Arduino.ORDER_NONE);
    //define sonar settings
    Blockly.Arduino.definitions_['define_newping_h'] = "#include <NewPing.h>\n";
    Blockly.Arduino.definitions_['define_sonar_trig_' + value_trig] = "#define TRIGGER_PIN_" + value_trig + " " + value_trig + "\n";
    Blockly.Arduino.definitions_['define_sonar_echo_ ' + value_echo] = "#define ECHO_PIN_" + value_echo + " " + value_echo + "\n";
    Blockly.Arduino.definitions_['define_sonar_max_distance'] = "#define MAX_DISTANCE 200 \n";
    //define sonar sensor
    Blockly.Arduino.definitions_['define_sonar_sensor_' + value_trig + value_echo] = "NewPing sonar"
            + value_trig + value_echo + "(TRIGGER_PIN_" + value_trig + ", ECHO_PIN_" + value_echo + ", MAX_DISTANCE);\n";
    //  Assemble Arduino into code variable.
    var code = "sonar" + value_trig + value_echo + '.ping_cm()';

    return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['remote_sensor'] = function (block) {
  var value_tsop = Blockly.Arduino.valueToCode(block, 'tsop', Blockly.Arduino.ORDER_NONE);
  Blockly.Arduino.definitions_['define_remote'] = "int __remote(int pinNumber)\n{\nint value = 0;\nint time = pulseIn(pinNumber,LOW);\n \
    if(time>2000)\n{\nfor(int counter1=0;counter1<12;counter1++)\n{\nif(pulseIn(pinNumber,LOW)>1000)\n{\nvalue = value + (1<< counter1);\n \
    }\n}\n}\n return value;\n}\n";
  var code = "__remote("+value_tsop+")";
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['dwengo_sensorboard_sensor'] = function (block) {
  var value_sensor = Blockly.Arduino.valueToCode(block, 'sensor', Blockly.Arduino.ORDER_NONE);
  var value_mode = Blockly.Arduino.valueToCode(block, 'mode', Blockly.Arduino.ORDER_NONE);
  Blockly.Arduino.definitions_['define_sensorboard_sensor'] = "#include <DwenguinoSensorPanel.h>\n\nSensorPanel sensorpanel;\n";
  Blockly.Arduino.setups_['setup_sensorboard'] = "sensorpanel = SensorPanel();\nsensorpanel.init();\nsensorpanel.powerLongRange(true);"
  var code = "sensorpanel.readSensor("+value_sensor+","+value_mode+")";
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['dwengo_sensorboard'] = function (block) {
  var value_led = Blockly.Arduino.valueToCode(block, 'led', Blockly.Arduino.ORDER_ATOMIC);
  var value_state = Blockly.Arduino.valueToCode(block, 'state', Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.definitions_['define_sensorboard'] = "#include <DwenguinoSensorPanel.h>\n\nSensorPanel sensorpanel_LED;\n";
  Blockly.Arduino.setups_['setup_sensorboard'] = "sensorpanel_LED = SensorPanel();\nsensorpanel_LED.init();\n"
  var code = "sensorpanel_LED.setHeadlights("+value_led+","+value_state+");";
  return code;
};

Blockly.Arduino['dwenguino_servo'] = function (block) {
    var value_channel = Blockly.Arduino.valueToCode(block, 'channel', Blockly.Arduino.ORDER_ATOMIC);
    var value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);
    var code;
    //define sonar settings
    Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";
    Blockly.Arduino.definitions_['define_servo_' + value_channel] = "Servo servo" + value_channel + ";\n";

    Blockly.Arduino.setups_['define_dwenguino_servo' + value_channel] = 'servo' + value_channel + '.attach(SERVO_' + value_channel + ');\n';
    if( (value_angle < 0 ) || (value_angle > 180 )) {
      alert("angle should be between 0 to 180")
      return code;
    }
    // Assemble JavaScript into code variable.
    code = 'servo' + value_channel + '.write(' + value_angle + ');\n';
    return code;
};

Blockly.Arduino['dwenguino_controls_while'] = function (block) {
    var value_condition = Blockly.Arduino.valueToCode(block, 'CONDITION', Blockly.Arduino.ORDER_ATOMIC);
    var statements_looped_code = Blockly.Arduino.statementToCode(block, 'LOOPED_CODE');
    //  Assemble Arduino into code variable.
    var code = 'while(' + value_condition + '){\n'
            + statements_looped_code + '\n}\n';
    return code;
};


Blockly.Arduino['dwenguino_constants'] = function (block) {
    var constant_value = block.getFieldValue('DWENGUINO_CONSTANT');
    return [constant_value, Blockly.Arduino.ORDER_ATOMIC];
};
