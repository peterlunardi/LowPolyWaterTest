    #version 330 core

	layout (location = 0) in vec3 aPos;
	layout (location = 1) in vec2 aTexCoords;
	layout (location = 2) in vec3 aNormal;


	out VS_OUT {
		vec3 FragPos;
		vec3 Normal;
		vec2 TexCoords;
	} vs_out;

	uniform mat4 MVP;

void main()
{
    vs_out.FragPos = aPos;
    vs_out.Normal = aNormal;
    vs_out.TexCoords = aTexCoords * 11;
    gl_Position = MVP * vec4(aPos, 1.0);
}