#version 330 core

in vec3 finalColour;
in vec3 Normal;
in vec3 Position;

out vec4 out_Colour;

uniform samplerCube skybox;
uniform vec3 cameraPosition;

void main(void){

	vec3 I = normalize(Position - cameraPosition);
    vec3 R = reflect(I, normalize(Normal));
    vec4 reflectColour = vec4(texture(skybox, R).rgb, 1.0);

	out_Colour = mix(reflectColour, vec4(finalColour, 0.7), 0.6);

}